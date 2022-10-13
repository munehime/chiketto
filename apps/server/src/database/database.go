package database

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/munehime/chiketto/src/config"
)

var client *mongo.Client

func Connect() error {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI(config.Get().Database.URI))
	if err != nil {
		return fmt.Errorf("error while creating MongoDB client: %+v", err)
	}

	ctx, cancel := context.WithTimeout(context.TODO(), 10*time.Second)
	defer cancel()

	if err = client.Connect(ctx); err != nil {
		return fmt.Errorf("error while connecting to MongoDB: %+v", err)
	}

	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		return fmt.Errorf("error while pinging to MongoDB: %+v", err)
	}

	return nil
}

func GetDatabase(name string) *mongo.Database {
	return client.Database(name)
}
