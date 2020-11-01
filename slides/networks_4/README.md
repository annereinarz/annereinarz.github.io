## Build

Follow the instructions on [reveal.js](https://github.com/hakimel/reveal.js/tree/33bed47daca3f08c396215415e6ece005970734a), or just install Node.js 4.0.0 or later and do:

```bash
npm install
npm start
```

and go to [localhost:8000](http://localhost:8000/) to see the slides.

## Convert to PDF

See section "[Export to PDF](https://github.com/hakimel/reveal.js/tree/33bed47daca3f08c396215415e6ece005970734a#pdf-export)" in the reveal.js README.

[Decktape](https://github.com/astefanutti/decktape) does a marvelous job converting this presentation to PDF, even the chart.js plots. Get the Docker image (see Decktape README) and run (for localhost):

```bash
docker run --rm -t --net=host -v `pwd`:/slides astefanutti/decktape -s 1024x768 http://localhost:8000 slides.pdf
```

## License & more

- License: [CreativeCommons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
- Based on [MakisH/nlrse19-slides](https://github.com/MakisH/nlrse19-slides)
- Based on [reveal.js](https://github.com/hakimel/reveal.js). Template based on the "White" template by Hakim El Hattab.
- See plugin information in the `plugin/` directory.

