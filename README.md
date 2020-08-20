# Purdue ACM Website

The ACM homepage, hosted at https://acm.cs.purdue.edu.

Built with [Jekyll](https://jekyllrb.com/) using the [Jalpc Theme](https://github.com/jarrekk/Jalpc).

## Contributing

This repository and website belongs to the officers of ACM and all updates will need to be approved by them. Please feel free to submit PRs and issues to this repo as necessary.

The source for the website can be found in the `src` directory of the website.

### Updating Information (Leadership, Upcoming Events, etc.)

All of the information on the website that is subject to change from year to year can be found in the site's data files (`acm-website/src/_data/index/*`). These files are all in [YAML](http://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html) format, and should be very easy to change as a result. There is no need to modify any of the HTML files, just modify these data files.

### Building the Docs

The site is build with [Jekyll](https://jekyllrb.com/).

Jekyll depends on Ruby for building, so following the [installation guides](https://jekyllrb.com/docs/installation/) is recommended.

Once you have Jekyll installed, building the docs is as simple as running `jekyll serve`in the `src` directory of this repo.
