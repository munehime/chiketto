package config

import (
	"fmt"
	"strings"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
)

var (
	config   = &Config{}
	instance *viper.Viper
)

func Setup(env string) error {
	instance = viper.New()
	instance.SetConfigType("yaml")
	instance.SetConfigName(env)
	instance.AddConfigPath("./config/")

	instance.AutomaticEnv()
	instance.SetEnvPrefix("VCL")
	instance.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := instance.ReadInConfig(); err != nil {
		return fmt.Errorf("error on parsing configuration file %+v", err)
	}

	if err := instance.Unmarshal(&config, func(config *mapstructure.DecoderConfig) {
		config.TagName = "yaml"
		config.DecodeHook = mapstructure.TextUnmarshallerHookFunc()
	}); err != nil {
		return fmt.Errorf("error on parsing configuration file: %+v", err)
	}

	return nil
}

func Get() *Config {
	return config
}

func Instance() *viper.Viper {
	return instance
}
