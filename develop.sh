open_new_terminal() {
	osascript -e "tell application \"Terminal\"" \
		-e "do script \"${1}\"" \
		-e "tell application \"Terminal\" to activate" \
		-e "end tell" > /dev/null
}

open_new_terminal_tab() {
	osascript -e "tell application \"Terminal\"" \
		-e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
		-e "do script \"${1}\" in front window" \
		-e "end tell" > /dev/null
}

open_new_terminal ""
open_new_terminal_tab "cd ~/repositories/oliverlundquist/moments && node ./node_modules/watchify/bin/cmd.js ./app.js -o ./public/assets/js/main.js -v"
open_new_terminal_tab "cd ~/repositories/oliverlundquist/moments/public && php -S 0.0.0.0:8080"
