.PHONY: all clean serve

all:
	cd ./src && jekyll build && rsync -a -I --exclude=Makefile ./_site/. ../ && echo "files copied!" && cd ../

clean:
	cd ./src && jekyll clean && cd ../

serve:
	cd ./src && jekyll serve && cd ../
