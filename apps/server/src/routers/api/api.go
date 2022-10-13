package api

import (
	"github.com/gofiber/fiber/v2"
)

func Mount(app *fiber.App, prefix string) {
	apiRouter := app.Group(prefix)

	apiRouter.Get("/hello", func(ctx *fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"message": "Hello",
		})
	})
}
