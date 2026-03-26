#!/bin/bash

_check_install() {
	if [ -z "$(command -v "createdb")" ]; then
		sudo apt install -y postgresql
	fi
}

_create-db() {
	sudo -u postgres dropuser "$USER"
	sudo -u postgres createuser -s "$USER"

	createdb trutrafik
}

_check_install
_create-db
