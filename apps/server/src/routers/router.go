package routers

import (
	"github.com/gofiber/fiber/v2"

	apiRouter "github.com/munehime/chiketto/src/routers/api"
)

func Mount(app *fiber.App) {
	apiRouter.Mount(app, "/server")
}
