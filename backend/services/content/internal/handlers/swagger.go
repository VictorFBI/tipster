package handlers

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"tipster/backend/content/internal/logging"

	"gopkg.in/yaml.v2"
)

func readOpenAPIYAML() ([]byte, error) {
	paths := []string{"api/openapi.yaml", "../../api/openapi.yaml"}
	var lastErr error
	for _, p := range paths {
		b, err := os.ReadFile(p)
		if err == nil {
			return b, nil
		}
		lastErr = err
	}
	return nil, lastErr
}

func OpenAPIDoc(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "openapi_doc"))
	yamlData, err := readOpenAPIYAML()
	if err != nil {
		log.Error("openapi_read_failed", slog.String("error", err.Error()))
		http.Error(w, "Failed to read OpenAPI spec: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var data interface{}
	if err := yaml.Unmarshal(yamlData, &data); err != nil {
		log.Error("openapi_parse_failed", slog.String("error", err.Error()))
		http.Error(w, "Failed to parse OpenAPI spec: "+err.Error(), http.StatusInternalServerError)
		return
	}

	data = convertToJSONCompatible(data)

	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Error("openapi_json_failed", slog.String("error", err.Error()))
		http.Error(w, "Failed to convert to JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func convertToJSONCompatible(v interface{}) interface{} {
	switch val := v.(type) {
	case map[interface{}]interface{}:
		result := make(map[string]interface{})
		for k, v := range val {
			key := fmt.Sprintf("%v", k)
			result[key] = convertToJSONCompatible(v)
		}
		return result
	case []interface{}:
		result := make([]interface{}, len(val))
		for i, v := range val {
			result[i] = convertToJSONCompatible(v)
		}
		return result
	default:
		return v
	}
}
