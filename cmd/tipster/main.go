package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type Person struct {
	name string
	surname string
}

func main() {
	server := gin.Default()

	server.GET("/ping", func(ctx *gin.Context) {
		var person Person
		err := ctx.BindJSON(&person)
		if err != nil {
			fmt.Print("HERE")
		}
	})

	server.Run(":8080")
}
