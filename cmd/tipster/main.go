package main

import (
	"github.com/gin-gonic/gin"

	swaggerfiles "github.com/swaggo/files"
	ginswagger "github.com/swaggo/gin-swagger"
	
	auth "github.com/VictorFBI/tipster/internal/api/auth"
	servers "github.com/VictorFBI/tipster/internal/servers/auth"
)

func main() {
	router := gin.Default()

	router.StaticFile("/api.yaml", "../../api/api.yaml")
	router.StaticFile("/auth.yaml", "../../api/auth.yaml")

	router.GET("/swagger/*any", ginswagger.WrapHandler(
		swaggerfiles.Handler,
		ginswagger.URL("/api.yaml"),
		ginswagger.URL("/auth.yaml"),
		ginswagger.DefaultModelsExpandDepth(-1),
	))

	authServer := &servers.AuthServer{}
	auth.RegisterHandlers(router, authServer)
		

	router.Run(":8080")
}
