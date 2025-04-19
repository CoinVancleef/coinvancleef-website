import React from 'react';
import Head from 'next/head';

const FaqPage = () => {
  const faqs = [
    {
      id: 'danmaku-calculation',
      question: 'How are Danmaku Points calculated?',
      answer: (
        <>
          <p>Danmaku Points are calculated based on multiple sources, including:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <a
                href="https://touhouworldcup.com/twcscore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Touhou World Cup Score Calculator
              </a>
            </li>
            <li>
              <a
                href="https://zps-stg.github.io/dc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                ZPS Touhou Difficulty Chart
              </a>
            </li>
            <li>Consultations with other Touhou players</li>
            <li>Personal adjustments to balance the system</li>
          </ul>
        </>
      ),
    },
    {
      id: 'total-points',
      question: 'How is my total Danmaku Points score calculated?',
      answer: (
        <>
          <p>
            Your total Danmaku Points score uses a weighted system inspired by{' '}
            <a
              href="https://osu.ppy.sh/wiki/en/Performance_points/Weighting_system"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300"
            >
              osu!'s performance point weighting system
            </a>
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Clears are ranked from highest to lowest point value</li>
            <li>Your highest clear contributes 100% of its value</li>
            <li>
              Each subsequent clear's contribution decreases by 5% (using a 0.95 decay factor)
            </li>
            <li>After your top 20 clears, a steeper decay factor is applied</li>
          </ul>
        </>
      ),
    },
    {
      id: 'replay-uploads',
      question: 'Where do I upload my replays to link them in the submission form?',
      answer: (
        <>
          <p>
            You can upload your replays to several services and then provide the link in our
            submission form:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <a
                href="https://www.silentselene.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Silent Selene
              </a>{' '}
            </li>
            <li>
              <a
                href="https://replay.lunarcast.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Lunarcast Replay Database
              </a>{' '}
            </li>
            <li>
              <a
                href="https://drive.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Google Drive
              </a>{' '}
            </li>
            <li>
              <a
                href="https://mega.nz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                MEGA
              </a>{' '}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'skill-accuracy',
      question: 'Do Danmaku Points accurately represent my skill?',
      answer: (
        <>
          <p>
            While Danmaku Points provide a useful metric, they cannot perfectly represent your
            skill. Any point-based system will naturally have subjective elements and the system
            focuses on survival achievements, and scoring is completely unaccounted for.
            <br />
            Danmaku Points should be viewed as one useful measurement of achievement rather than a
            definitive skill representation.
          </p>
        </>
      ),
    },
    {
      id: 'future-difficulties',
      question: 'Will other difficulties be added in the future?',
      answer: (
        <>
          <p>
            I'm considering adding support for more difficulties in the future. However, several
            factors will influence this decision:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Database capacity constraints with my current hosting solution</li>
            <li>User interest and feedback</li>
          </ul>
        </>
      ),
    },
    {
      id: 'missing-games',
      question: 'Why are some games not added to the website?',
      answer: (
        <>
          <p>Some Touhou games are currently not included in our system for specific reasons:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>PC-98 games are omitted due to difficulty in evaluation</li>
            <li>Unfinished Dream of All Living Ghost presents challenges with its dual versions</li>
          </ul>
          <p className="mt-2">
            I may add these games in the future with input from players who have comprehensive ideas
            on how to address these evaluation complexities.
          </p>
        </>
      ),
    },
    {
      id: 'bug-reporting',
      question: "Where can I report a bug I've encountered?",
      answer: (
        <>
          <p>
            If you encounter any bugs or issues, you can reach out through coinvancleef on Discord
            or via{' '}
            <a
              href="https://twitter.com/coinvancleef"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Twitter
            </a>
            . Please include as much detail as possible, including steps to reproduce the issue,
            your browser/device information, and screenshots if applicable.
          </p>
        </>
      ),
    },
    {
      id: 'inspiration',
      question: 'What inspired this project?',
      answer: (
        <>
          <p>This project draws inspiration from several sources:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>osu!'s PP system</li>
            <li>
              <a
                href="https://maribelhearn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Maribel Hearn's website
              </a>{' '}
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>FAQ - Coinvancleef</title>
        <meta
          name="description"
          content="Frequently Asked Questions about CoinVancleef and Danmaku Points"
        />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h1>

        {/* FAQ Navigation */}
        <div className="bg-gray-800 rounded-lg px-4 py-2 shadow-md mb-8">
          <ul className="divide-y divide-gray-700">
            {faqs.map(faq => (
              <li key={faq.id} className="py-2">
                <a href={`#${faq.id}`} className="text-indigo-400 hover:text-indigo-300">
                  {faq.question}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              id={faq.id}
              className="bg-gray-800 rounded-lg p-6 shadow-md scroll-mt-8"
            >
              <h2 className="text-xl font-semibold text-white mb-4">{faq.question}</h2>
              <div className="text-gray-300">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FaqPage;
