package kafka

import (
	"context"
	"fmt"
	"os"
	"strings"

	kafka "github.com/segmentio/kafka-go"
)

// Client holds Kafka broker addresses; use it to create Writer/Reader
type Client struct {
	Brokers []string
}

// Connect parses KAFKA_BROKERS (comma-separated, default localhost:9092), dials first broker to verify, returns Client
func Connect(ctx context.Context) (*Client, error) {
	brokersStr := getEnvOrDefault("KAFKA_BROKERS", "localhost:9092")
	if brokersStr == "" {
		return nil, fmt.Errorf("KAFKA_BROKERS environment variable is not set")
	}

	brokers := parseBrokers(brokersStr)
	if len(brokers) == 0 {
		return nil, fmt.Errorf("no valid brokers in KAFKA_BROKERS")
	}

	conn, err := kafka.DialContext(ctx, "tcp", brokers[0])
	if err != nil {
		return nil, fmt.Errorf("kafka dial %s: %w", brokers[0], err)
	}
	
	_ = conn.Close()
	return &Client{Brokers: brokers}, nil
}

// NewWriter creates a kafka.Writer for the given topic using client brokers
func (c *Client) NewWriter(topic string) *kafka.Writer {
	return kafka.NewWriter(kafka.WriterConfig{
		Brokers: c.Brokers,
		Topic:   topic,
	})
}

// NewReader creates a kafka.Reader for the given topic and group using client brokers
func (c *Client) NewReader(topic, groupID string) *kafka.Reader {
	return kafka.NewReader(kafka.ReaderConfig{
		Brokers: c.Brokers,
		Topic:   topic,
		GroupID: groupID,
	})
}

// Close is a no-op for Client that only holds broker list
func (c *Client) Close() error {
	return nil
}

func parseBrokers(s string) []string {
	parts := strings.Split(strings.TrimSpace(s), ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func getEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
