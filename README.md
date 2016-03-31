# Starter Kit


The boilerplate for new web builds.

## Install gulp

If you don’t already have gulp installed, you’ll need to do that first.

[Gulp installation instructions](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## Getting Started

Install dependencies and run default task

		npm install
		gulp

## gulp Commands

**Default** - Compile all files and watches for changes

        gulp

**Minify JS** - Run uglify on JavaScript

		gulp scripts
		
**Concatenate Plugins** - Combine vendor plugins into a single file and uglify

		gulp plugins

**Images** - Run imagemin on images 

        grunt imagemin

**Twig** - Compile Twig templates

        grunt twig