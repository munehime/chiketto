package config

type Config struct {
	Database       Database       `yaml:"database"`
	Redis          Redis          `yaml:"redis"`
	Authentication Authentication `yaml:"authentication"`
	CORS           CORS           `yaml:"cors"`
	Server         Server         `yaml:"server"`
}

type Database struct {
	URI  string `yaml:"uri"`
	Name string `yaml:"name"`
}

type DatabaseSettings struct {
	Name string `yaml:"name"`
}

type Redis struct {
	DBIndex uint8  `yaml:"dbIndex"`
	URL     string `yaml:"url"`
}

type Authentication struct {
	CookieDomain string `yaml:"cookieDomain"`
	JWT          struct {
		AccessTokenSecret  string `yaml:"accessTokenSecret"`
		RefreshTokenSecret string `yaml:"refreshTokenSecret"`
	} `yaml:"jwt"`
}

type CORS struct {
	AllowOrigins string `yaml:"allowOrigins"`
}

type Server struct {
	Server ServerSettings `yaml:"server"`
	Admin  ServerSettings `yaml:"admin"`
	Main   ServerSettings `yaml:"main"`
}

type ServerSettings struct {
	Host      string `yaml:"host"`
	Port      uint16 `yaml:"port"`
	PublicURL string `yaml:"publicUrl"`
}
