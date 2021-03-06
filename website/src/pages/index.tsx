/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
// TODO: enable eslint
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import JavascriptSVG from '@site/static/img/features/javascript.svg';
import BrowserSVG from '@site/static/img/features/browser.svg';
import cl from 'classnames';
import UnitySVG from '@site/static/img/features/unity.svg';
import ServerLessSVG from '@site/static/img/features/serverless.svg';
import FrameWorkSVG from '@site/static/img/features/framework.svg';
import DeveloperSVG from '@site/static/img/features/developer.svg';
import AISVG from '@site/static/img/features/ai.svg';
import CloudSVG from '@site/static/img/features/cloud.svg';
import BlocksSVG from '@site/static/img/features/blocks.svg';
import UrltSVG from '@site/static/img/features/url.svg';
import DynamicSVG from '@site/static/img/features/dynamic.svg';
import APISVG from '@site/static/img/features/api.svg';
import AppSVG from '@site/static/img/features/app.svg';
import WebServerSVG from '@site/static/img/features/web-server.svg';
import HTMLSVG from '@site/static/img/features/html.svg';
import CodingBackEndSVG from '@site/static/img/features/coding-backend.svg';
import ServerNetworkSVG from '@site/static/img/features/server-network.svg';
import FrameworksSVG from '@site/static/img/features/frameworks.svg';
import CustomizeSVG from '@site/static/img/features/customize.svg';
import TrinitySVG from '@site/static/img/features/trinity.svg';
import CompilerSVG from '@site/static/img/features/compiler.svg';
import CssFileSVG from '@site/static/img/features/css-file.svg';
import FrameWorkConfigSVG from '@site/static/img/features/framework-config.svg';
import TestSVG from '@site/static/img/features/test.svg';
import EditorSVG from '@site/static/img/features/editor.svg';
import ProductSVG from '@site/static/img/features/product.svg';
import VisualSVG from '@site/static/img/features/visual.svg';
import MonorepoSVG from '@site/static/img/features/monorepo.svg';
import VideoCard from '../components/VideoCard';
import NavTabs from '../components/NavTabs';
import QuickStartCard from '../components/QuickStartCard';
import FlowCard from '../components/FlowCard';
import ContentCard, { ContentCardProps } from '../components/ContentCard';
import SecondaryTitle from '../components/SecondaryTitle';
import { Featurelayout } from '../components/FeatureLayout';
import Features from '../components/HomePageFeatures';
import styles from './index.module.css';
import 'swiper/css';

const headerTabs = [
  {
    tabName: '????????????',
    href: '/docs/start/mobile',
  },
  {
    tabName: '???????????????',
    href: '/docs/start/website',
  },
  {
    tabName: '?????????',
    href: '/docs/start/admin',
  },
  {
    tabName: '?????????',
    href: '/docs/start/micro-frontend',
  },
  {
    tabName: '????????????',
    href: '/docs/start/electron',
  },
  {
    tabName: 'API??????',
    href: '/docs/start/api-service',
  },
  {
    tabName: '?????????',
    href: '/docs/start/library',
  },
  {
    tabName: 'UI??????',
    href: '/docs/start/component',
  },
];

const features = [
  {
    icon: BrowserSVG,
    desc: '????????????????????? Web ??????',
    href: '/docs/guides/tutorials/c01-getting-started/1.2-minimal-mwa',
  },
  {
    icon: JavascriptSVG,
    desc: 'JS ????????????FP ????????? GUI ?????????????????????',
    href: '/docs/guides/tutorials/c07-app-entry/7.1-intro',
  },
  {
    icon: UnitySVG,
    desc: '???????????????????????????????????????????????????',
    href: '/docs/guides/features/server-side/web/routes',
  },
  {
    icon: ServerLessSVG,
    desc: 'Serverless ??????',
    href: '/docs/guides/tutorials/c09-bff/9.1-serverless',
  },
  {
    icon: FrameWorkSVG,
    desc: '??? Web ???????????????????????????',
    href: '/docs/guides/tutorials/c01-getting-started/1.2-minimal-mwa',
  },
  {
    icon: DeveloperSVG,
    desc: 'DX ??? UX ???????????????',
    href: '/docs/guides/usages/compatibility',
  },
  {
    icon: AISVG,
    desc: '?????????',
    href: '/docs/guides/tutorials/c03-ide/3.2-hints-in-ide',
  },
  {
    icon: CloudSVG,
    desc: '?????????',
    href: '/coming-soon',
  },
  {
    icon: BlocksSVG,
    desc: '?????????',
    href: '/coming-soon',
  },
];
const universalGroups: ContentCardProps[] = [
  {
    title: '????????????????????????????????????????????????????????????',
    img: UrltSVG,
    href: '/docs/guides/tutorials/c07-app-entry/7.1-intro',
  },
  {
    title: 'Serverless ???????????????????????? Web???',
    img: DynamicSVG,
    href: '/docs/guides/features/server-side/web/ssg',
  },
  {
    title: '???????????????????????????????????????BFF?????????',
    img: APISVG,
    href: '/docs/guides/tutorials/c09-bff/9.2-enable-bff',
  },
  {
    title: '?????????????????????',
    img: AppSVG,
    href: '/docs/guides/features/electron/basic',
  },
];

const feBe: ContentCardProps[] = [
  {
    title: '?????? Web Server',
    img: WebServerSVG,
    href: '/docs/guides/tutorials/c01-getting-started/1.4-enable-ssr',
  },
  {
    title: '????????? SSR/SPR/SSG',
    img: HTMLSVG,
    href: '/docs/guides/features/server-side/web/ssr-and-spr',
  },
  {
    title: '????????? BFF',
    img: CodingBackEndSVG,
    href: '/docs/guides/features/server-side/bff/function',
  },
  {
    title: '??? Serverless ??????',
    img: ServerNetworkSVG,
    href: '/coming-soon',
  },
  {
    title: '?????????',
    img: FrameworksSVG,
    href: '/docs/guides/features/server-side/bff/frameworks',
  },
  {
    title: '?????? Web Server',
    img: CustomizeSVG,
    href: '/docs/guides/features/server-side/web/web-server',
  },
  {
    title: '????????????',
    img: TrinitySVG,
    href: '/docs/start/api-service',
  },
];

const flowCards = [
  {
    title: '??????',
    img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.003.jpeg',
    href: '/docs/guides/tutorials/c02-generator-and-studio/2.1-generator',
    top: 53,
  },
  {
    title: '??????',
    img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.004.jpeg',
    href: '/docs/guides/tutorials/c03-ide/3.1-setting-up',
    top: 120,
  },
  {
    title: '??????',
    href: '/docs/guides/tutorials/c06-css-and-component/6.6-testing',
    top: 423,
  },
  {
    title: '??????',
    href: '/docs/guides/usages/debug/proxy-and-mock',
    top: 490,
  },
  {
    title: '??????',
    img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.005.jpeg',
    href: '/docs/apis/commands/module/build',
    top: 545,
  },
  {
    title: '??????',
    img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.007.jpeg',
    href: '/docs/guides/usages/compatibility',
    top: 610,
  },
  {
    title: '??????',
    img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js//modern-js-landing-pics.008.jpeg',
    href: '/coming-soon',
    top: 915,
  },
];

const bestPractice = [
  {
    title: 'Post-Webpack Era',
    img: CompilerSVG,
    href: '/docs/guides/usages/debug/unbundled',
  },
  {
    title: 'CSS ????????????',
    img: CssFileSVG,
    href: '/docs/guides/tutorials/c06-css-and-component/6.1-css-in-js',
  },
  {
    title: '???????????????????????????????????????',
    img: FrameWorkConfigSVG,
    href: '/docs/guides/tutorials/c01-getting-started/1.2-minimal-mwa',
  },
  {
    title: '???????????????????????????',
    img: TestSVG,
    href: '/docs/guides/tutorials/c11-container/11.4-testing',
  },
  {
    title: 'ESLint ??????????????????IDE ??????',
    img: EditorSVG,
    href: '/docs/guides/tutorials/c03-ide/3.1-setting-up',
  },
  {
    title: '????????????????????????',
    img: ProductSVG,
    href: '/docs/guides/features/modules/build',
  },
  {
    title: 'Visual Testing',
    img: VisualSVG,
    href: '/docs/guides/features/modules/storybook',
  },
  {
    title: 'Monorepo',
    img: MonorepoSVG,
    href: '/docs/guides/features/monorepo/intro',
  },
];

const HomepageHeader = () => (
  <div className={styles['homepage-header']}>
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-logo.svg"
        className={styles.logo}
      />
      <h1 className={styles.title}>?????? Web ????????????</h1>
      <div className={styles.buttons}>
        <Link
          className={styles.start}
          to="https://zhuanlan.zhihu.com/p/426707646">
          ??????{' '}
          <img
            width="20"
            height="20"
            className={styles['start-arrow']}
            src="https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/right-arrow.svg"
          />
        </Link>
        <Link className={styles['doc-btn']} to="/docs/start/mobile">
          ????????????{' '}
        </Link>
        <Link className={styles['doc-btn']} to="/docs/guides/overview">
          ??????
        </Link>
      </div>
    </header>
  </div>
);

const renderFlowCards = cards => {
  const isWeb = window.innerWidth > 1100;
  const flowLineImg = isWeb
    ? 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/flow-line-line.png'
    : 'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/flow-line-mobile.png';
  let top1 = 53;
  let top2 = 120;
  const distance = 530;
  const renderedWebCards = cards.map((card, cardIndex) => {
    if (cardIndex % 2 !== 0) {
      const top = top2;
      top2 += distance;
      return (
        <FlowCard
          key={cardIndex}
          cardStyle={{
            right: 0,
            top: `${card.top}px`,
            textDecoration: 'none',
          }}
          direction="left"
          title={card.title}
          desc={card.desc}
          img={card.img}
          href={card.href}
        />
      );
    } else {
      const top = top1;
      top1 += distance;
      return (
        <FlowCard
          key={cardIndex}
          cardStyle={{
            left: 0,
            top: `${card.top}px`,
            textDecoration: 'none',
          }}
          direction="right"
          title={card.title}
          desc={card.desc}
          img={card.img}
          href={card.href}
        />
      );
    }
  });

  const renderedMobileCards = cards.map((card, cardIndex) => {
    const left = 53;
    const top = 10;
    // const distance = cardIndex * 60;
    const distance = cardIndex * 65;
    return (
      <FlowCard
        cardStyle={{
          top: `calc(${top}px + ${distance}vw)`,
          // left: `${left}px`,
        }}
        key={cardIndex}
        title={card.title}
        desc={card.desc}
        img={card.img}
      />
    );
  });
  return (
    <div className={styles.flowContainer}>
      {isWeb && (
        <img
          className={`${styles.flowLine} ${isWeb ? '' : styles.flowLineMobile}`}
          src={flowLineImg}
          style={{
            width: '1px',
          }}
          alt="flow line"
        />
      )}
      {isWeb ? renderedWebCards : renderedMobileCards}
    </div>
  );
};

const renderCards = cards => {
  const isWeb = window.innerWidth > 966;
  if (isWeb) {
    return (
      <div className={styles.cardContainer}>{renderContentCards(cards)}</div>
    );
  } else {
    return (
      <Swiper slidesPerView={1.65} spaceBetween={18} className={styles.swiper}>
        {renderSwiperContentCards(cards)}
      </Swiper>
    );
  }
};

const renderSwiperContentCards = cards =>
  cards.map(({ title, desc, img, href }, index) => (
    <SwiperSlide key={title + index}>
      <ContentCard
        title={title}
        desc={desc}
        img={img}
        href={href}
        isSwiper={true}
      />
    </SwiperSlide>
  ));

const renderContentCards = cards =>
  cards.map((card, cardIndex) => (
    <ContentCard
      key={cardIndex}
      title={card.title}
      desc={card.desc}
      img={card.img}
      href={card.href}
    />
  ));

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const renderedUniVerals = renderSwiperContentCards(universalGroups);
  const bestPraticeCards = renderContentCards(bestPractice);
  let count = 1;
  return (
    <Layout
      // title={`${siteConfig.title}`}
      description="The meta-framework suite designed from scratch for frontend-focused modern web development.">
      <HomepageHeader />
      <NavTabs tabs={headerTabs} />
      <main className={styles['homepage-main']}>
        <Features title="???????????? Web ????????????" features={features} />
        <Featurelayout>
          <SecondaryTitle seqNum={++count}>?????? Web ?????????MWA???</SecondaryTitle>
          <h3 className={styles['section-title']}>
            ??? Universal JS ??? Universal App
          </h3>
          <div className={styles['swiper-container']}>
            <Swiper
              slidesPerView={1.65}
              spaceBetween={18}
              className={styles.swiper}
              breakpoints={{
                1023: {
                  slidesPerView: 4,
                },
                800: {
                  slidesPerView: 3,
                },
                200: {
                  slidesPerView: 1.65,
                },
              }}>
              {renderedUniVerals}
            </Swiper>
          </div>
          <h3 className={styles['section-title']}>??????????????????</h3>
          <div className={styles['swiper-container']}>
            <BrowserOnly>{() => renderCards(feBe)}</BrowserOnly>
          </div>
          <h3 className={styles['section-title']}>????????????</h3>
          <Link
            to="/docs/guides/tutorials/c10-model/10.1-application-architecture"
            className={cl(styles.singleImgWrap, styles.singleImgCard)}
            style={{ marginTop: '16px' }}>
            <img
              className={styles.singleImg}
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/framework.jpeg"
              alt="framework"
            />
          </Link>
          <h3 className={styles['section-title']}>Runtime API ?????????</h3>
          <Link
            to="/docs/guides/features/modules/use-runtime-api"
            className={cl(styles.singleImgWrap, styles.singleImgCard)}
            style={{ marginTop: '16px' }}>
            <img
              className={styles.singleImg}
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/runtime-api.jpeg"
              alt="framework"
            />
          </Link>
        </Featurelayout>
        <Featurelayout>
          <SecondaryTitle seqNum={++count}>????????????????????????</SecondaryTitle>
          <div className={styles.cardContainer}>{bestPraticeCards}</div>
        </Featurelayout>
        <Featurelayout>
          <SecondaryTitle seqNum={++count}>?????? Web ???????????????</SecondaryTitle>
          <BrowserOnly>{() => renderFlowCards(flowCards)}</BrowserOnly>
        </Featurelayout>
        <Featurelayout>
          <SecondaryTitle seqNum={++count}>????????????????????????</SecondaryTitle>
          <VideoCard
            title="??????????????????"
            imgUrl={
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js//modern-js-landing-pics.009.jpeg'
            }
            detailUrl="/docs/apis/hooks/overview"
          />
          <VideoCard
            title="?????????MWA???"
            direction="right"
            imgUrl={
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.010.jpeg'
            }
            detailUrl="/docs/guides/tutorials/c02-generator-and-studio/2.1-generator"
          />
          <VideoCard
            title="?????????Module???"
            imgUrl={
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.011.jpeg'
            }
            detailUrl="/docs/guides/features/modules/intro"
          />
          <VideoCard
            title="Monorepo"
            direction="right"
            imgUrl={
              'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.006.jpeg'
            }
            detailUrl="/docs/guides/features/monorepo/intro"
          />
        </Featurelayout>
        <Featurelayout>
          <SecondaryTitle seqNum={++count}>????????????????????????</SecondaryTitle>
          <a
            className={styles.singleImgWrap}
            href="/docs/guides/features/custom/framework-plugin/abstract">
            <img
              className={styles.singleImg}
              src={
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/aphqeh7uhohpquloj/modern-js/modern-js-landing-pics.012.jpeg'
              }
              alt=""
            />
          </a>
        </Featurelayout>
        <QuickStartCard />
      </main>
    </Layout>
  );
}
/* eslint-enable */
