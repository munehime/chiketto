package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func InsertOne(database string, collection string, document interface{}) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 30*time.Second)
	defer cancel()

	coll := GetDatabase(database).Collection(collection)
	result, err := coll.InsertOne(ctx, document)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return result.InsertedID.(primitive.ObjectID), nil
}

func FindMany[T any](database string, collection string, filter interface{}) ([]T, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 30*time.Second)
	defer cancel()

	coll := GetDatabase(database).Collection(collection)

	var outs []T

	cursor, err := coll.Find(ctx, filter)
	if err != nil {
		return outs, err
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {

		}
	}(cursor, ctx)

	for cursor.Next(ctx) {
		var out T
		if err := cursor.Decode(&out); err != nil {
			return outs, err
		}
		outs = append(outs, out)
	}

	return outs, nil
}

func FindOne[T any](database string, collection string, filter interface{}) (T, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 30*time.Second)
	defer cancel()

	coll := GetDatabase(database).Collection(collection)
	result := coll.FindOne(ctx, filter)

	var out T
	if err := result.Decode(&out); err != nil {
		return out, err
	}

	return out, nil
}

func UpdateOne(database string, collection string, filter interface{}, update interface{}) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 30*time.Second)
	defer cancel()

	coll := GetDatabase(database).Collection(collection)
	if _, err := coll.UpdateOne(ctx, filter, update); err != nil {
		return primitive.NilObjectID, err
	}

	return primitive.NilObjectID, nil
}

func FindAggregate[T any](database string, collection string, pipeline interface{}) ([]T, error) {
	ctx, cancel := context.WithTimeout(context.TODO(), 30*time.Second)
	defer cancel()

	var outs []T
	coll := GetDatabase(database).Collection(collection)
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return outs, err
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {

		}
	}(cursor, ctx)

	for cursor.Next(ctx) {
		var out T
		if err := cursor.Decode(&out); err != nil {
			return outs, err
		}
		outs = append(outs, out)
	}

	return outs, nil
}
