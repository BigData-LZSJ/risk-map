run: dep
	#source "./venv/bin/activate" && python app.py
	./venv/bin/python app.py
venv:
	virtualenv venv

dep: venv
	./venv/bin/pip install -r requirements.txt

clean-pyc:
	find . -name '*.pyc' -exec rm {} +
	find . -name '__pycache__' -exec rm -r {} +
