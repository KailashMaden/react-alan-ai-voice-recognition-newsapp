import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import alanBtn from '@alan-ai/alan-sdk-web';

import wordsToNumbers from 'words-to-numbers';

import { NewsCards, Modal } from './components';
import useStyles from './styles.js';
import alanImg from './components/image/alan.jpg';

const alanKey =
  'f5a60f80116776bd0c310a4121e222232e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];
          if (parsedNumber > 20) {
            alanBtn().playText('Please try that again..');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);
  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img src={alanImg} className={classes.alanLogo} alt="alan logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by Kailash Maden
            <a className={classes.link} href="https://github.com/KailashMaden">
              {' '}
              GitHub Profile
            </a>{' '}
            -
            <a
              className={classes.link}
              href="https://www.facebook.com/kailash.maden.9"
            >
              {' '}
              Facebook Profile
            </a>
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default App;
