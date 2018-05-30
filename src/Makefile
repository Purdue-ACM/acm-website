.PHONY: all clean serve

all:
	jekyll build && rsync -a --exclude=Makefile ./_site/. ../ && echo "files copied!"

clean:
	jekyll clean

serve:
	jekyll serve
