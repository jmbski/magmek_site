#!/bin/bash

_check_install() {
	if [ -z "$(command -v "createdb")" ]; then
		sudo apt install -y postgresql
	fi
}

_create-db() {
	createdb trutrafik
}

_check_install
_create-db
