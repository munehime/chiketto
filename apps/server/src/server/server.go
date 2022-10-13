package server

import (
	"os"
	"strconv"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/rs/zerolog/log"

	"github.com/munehime/chiketto/src/config"
	"github.com/munehime/chiketto/src/routers"
)

func Start() {
	app := fiber.New(fiber.Config{
		JSONDecoder: json.Unmarshal,
		JSONEncoder: json.Marshal,
	})

	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/metrics", monitor.New(monitor.Config{Title: "chiketto Metrics Page"}))

	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.Get().CORS.AllowOrigins,
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE",
		AllowHeaders:     "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Accept, Authorization, Content-Type, Origin, X-Requested-With, X-Auth-Token",
		AllowCredentials: true,
	}))

	routers.Mount(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = strconv.Itoa(int(config.Get().Servers.Server.Port))
	}

	log.Fatal().Err(app.Listen(":" + port)).Msg("Failed to start server")
}
