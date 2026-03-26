#!/bin/bash

_check_install() {
	if [ -z "$(command -v "createdb")" ]; then
		sudo apt install -y postgresql
	fi
}

_install-timescaledb() {
	sudo apt install gnupg postgresql-common apt-transport-https lsb-release wget
	sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
	echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
	wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg

	sudo apt update
	sudo apt install timescaledb-2-postgresql-18 postgresql-client-18
	sudo timescaledb-tune
	sudo systemctl restart postgresql
}

_install-postgis() {
	sudo apt install -y postgresql-16-postgis-3
}

_create-db() {
	sudo -u postgres dropuser "$USER"
	sudo -u postgres createuser -s "$USER"

	createdb trutrafik
}

_check_install
_create-db
