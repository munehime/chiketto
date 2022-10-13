package main

import (
	"os"

	"github.com/rs/zerolog/log"

	"github.com/munehime/chiketto/src/config"
	"github.com/munehime/chiketto/src/database"
	"github.com/munehime/chiketto/src/server"
)

func main() {
	env := os.Getenv("GO_ENV")
	if env == "" {
		env = "development"
		_ = os.Setenv("GO_ENV", env)
	}

	if err := config.Setup(env); err != nil {
		log.Error().Err(err).Send()
	} else {
		log.Info().Msg("Finished setup config")
	}

	if err := database.Connect(); err != nil {
		log.Error().Err(err).Send()
	} else {
		log.Info().Msg("Connected to database")
	}

	server.Start()
}
