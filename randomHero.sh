#!/usr/bin/env bash

jsonData=$(cat result.json)

heroesSize=$(echo $jsonData | jq length)

itemNumber=$(shuf -i 0-$heroesSize -n 1) 

name=$(echo $jsonData | jq -r ".[$itemNumber].name")

race=$(echo $jsonData | jq -r ".[$itemNumber].race")

biography=$(echo $jsonData | jq -r ".[$itemNumber].biography")

printf "Name: $name\nRace: $race\nBiography: $biography\n"
