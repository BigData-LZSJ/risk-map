GUNICORN_PID_FILE := .gunicorn_pid
run: dep
	@ #source "./venv/bin/activate" && python app.py
	./venv/bin/python app.py
venv:
	virtualenv venv

dep: .deped

.deped: venv
	@ ./venv/bin/pip install -r requirements.txt
	@ printf 'Successfully install requirements!\n'
	@ touch $@

clean-pyc:
	find . -name '*.pyc' -exec rm {} +
	find . -name '__pycache__' -exec rm -r {} +

deploy: decrypt
	gunicorn app:app

decrypt: .decrypted

.decrypted:
	@ ./decrypt.sh
	@ touch $@

only_gunicorn:
ifneq ($(wildcard ${GUNICORN_PID_FILE}),)
	@ kill $(shell cat ${GUNICORN_PID_FILE})
	@ rm .gunicorn_pid
	@ printf 'Kill old gunicorn process!\n'
endif

deploy_myvps: dep decrypt only_gunicorn
	./venv/bin/gunicorn app:app -b 127.0.0.1:9999 -D --pid=${GUNICORN_PID_FILE}

clean:
	@ rm -f .decrypted
	@ rm -f .deped
