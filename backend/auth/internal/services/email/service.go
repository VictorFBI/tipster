package email

import (
	"context"
	"os"
	"math/big"
	"crypto/rand"
	"fmt"

	"gopkg.in/mail.v2"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic(err)
	}
}

func generate6DigitCode() (string, error) {
    max := big.NewInt(1000000)
    n, err := rand.Int(rand.Reader, max)
    if err != nil {
        return "", err
    }
    return fmt.Sprintf("%06d", n.Int64()), nil
}

type EmailService struct {
}

func New() *EmailService {
	return &EmailService{}
}

func (es *EmailService) SendEmailRegistration(ctx context.Context, email string) error {
	m := mail.NewMessage()
	code, err := generate6DigitCode()
	if err != nil {
		return err
	}
	m.SetHeader("From", "fvictorb04@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", fmt.Sprintf("Your Tipster registration code is %s", code))
	m.SetBody("text/plain", fmt.Sprintf("Your Tipster registration code is %s", code))

	appLogin := os.Getenv("EMAIL_APP_LOGIN")
	if appLogin == "" {
		panic("EMAIL_LOGIN environment variable is not set")
	}

	appPassword := os.Getenv("EMAIL_APP_PASSWORD")
	if appPassword == "" {
		panic("EMAIL_PASSWORD environment variable is not set")
	}

	d := mail.NewDialer(
		"smtp.gmail.com",
		587,
		appLogin,
		appPassword,
	)

	return d.DialAndSend(m)
}