# Purdue ACM Website

The ACM homepage, hosted at https://acm.cs.purdue.edu.

Built with [Jekyll](https://jekyllrb.com/) using the [Jalpc Theme](https://github.com/jarrekk/Jalpc).

## Contributing

This repository and website belongs to the officers of ACM and all updates will need to be approved by them. Please feel free to submit PRs and issues to this repo as necessary.

### Updating Information (Leadership, Upcoming Events, etc.)

All of the information on the website that is subject to change from year to year can be found in the site's data files (`_data/index/*`).
These files are all in [YAML](http://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html) format, and should be very easy to change as a result. There is no need to modify any of the HTML files, just modify these data files.

### Building the Docs

The site is build with [Jekyll](https://jekyllrb.com/).

First download ruby.

Then install bundler. This is a package management software for ruby.

```
gem install bundler
```

To install all the dependencies, run the following command in the project directory.

```
bundler install
```

Now you can build / serve the server.

In order to run a local development server.

```
bundler exec jekyll serve
```

In order to build the static site assets, which are stored in \_site.

```
bundler exec jekyll build
```

### How Deployment Work

```
./.github/workflows/deploy.yml
```

Configures a pipeline for building and deploying the website.

Steps:

1. Checkout -- Fetches code
2. Setup Ruby - Installs ruby
3. Ruby Gem Cache -- Sets up dependency caching for future builds
4. Install Gems -- Install dependencies for building the site
5. Build Jekyll -- Calls jekyll to build the website
6. Deploy to Github Pages -- Deploys the ./\_site directory to the gh-pages branch

Site is then accessible at http://purdue-acm.github.io/acm-website/.

### Project Structure

```
HTML Pages (generally don't need to modify)

├── index.html # renders the main page
├── sponsorship_tiers.html # renders sponsor tiers page
├── 404.html # the 404 file for when a url isn't found

HTML rendering templates (generally don't need to modify)

├── _includes # page components (injected into pages)
├── _layouts # the standard layout for a page (wraps page)

Data sources that get rendered into the html.
This should be modified each year

├── _data # data files that are rendered (modify each year. it's pretty simple)
│   ├── index
│   └── landing.yml

Images / css / javascript and other static assets

├── _sass # the main page styling, generally modify _style.scss
└── static # this is where images / styling / js is added
    ├── assets # images & fonts
    ├── css # add/modify _sass instead
    └── js # javascript for dynamic page components


Jekyll / Site Configuration
├── _config.yml # jekyll site configuration
├── Gemfile # the dependencies list
├── Gemfile.lock # do not manually modify. locks dependencies

Build
├── _site # automatically generated on build. do not modify
```
