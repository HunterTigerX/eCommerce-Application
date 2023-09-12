import { GithubOutlined } from '@ant-design/icons';
import AboutUs from '@assets/about.jpg';
import rss from '@assets/rss.jpg';
import nikita from '@assets/nikita.png';
import styles from './About.module.css';

export const About = () => {
  return (
    <>
      <div className={styles.about}>
        <div className={styles.aboutImgWrapper}>
          <img className={styles.aboutImg} src={AboutUs} alt="about" />
        </div>
        <p className={styles.text}>
          Hello, we are pleased to present you this website created by a team of three talented developers. Their
          unwavering commitment and tireless efforts, backed up by the knowledge gained at{' '}
          <span className={styles.blueText}>RS School</span> , have led to the creation of an outstanding and functional
          application.
        </p>
        <p className={styles.text}>
          We successfully developed our project using a combination of key technologies and tools.
          <ul className={styles.techList}>
            <li>
              <span className={styles.blueText}>React</span> was our primary framework, offering flexibility and
              performance for a user-friendly interface.
            </li>
            <li>
              <span className={styles.blueText}>TypeScript</span> enhanced our development process by providing strong
              typing and improved code quality.
            </li>
            <li>
              <span className={styles.blueText}>Ant Design</span> for the design and styling of our application, which
              allowed us to create a visually appealing and responsive user interface.
            </li>
            <li>
              <span className={styles.blueText}>Commerce tools</span> played a crucial role in managing e-commerce
              functionalities, ensuring seamless integration and efficient product management.
            </li>
            <li>
              <span className={styles.blueText}>Jira</span> played a vital role in task management, process control, and
              progress tracking, ensuring efficient team coordination and task transparency.
            </li>
            <li>
              <span className={styles.blueText}>Discord</span> served as our primary communication platform, enabling
              real-time discussions and quick issue resolution.
            </li>
          </ul>
          This effective communication was instrumental in resolving differences and making timely decisions. Together,
          these technologies and tools were pivotal in achieving our project&apos;s success, fostering collaboration,
          and helping us reach our goals.
        </p>
        <h2 className={styles.h2}>Meet the Team:</h2>
        <ul className={styles.team}>
          <li className={styles.teamCard}>
            <a className={styles.teamImage} href="https://github.com/huntertigerx" target="_blank" rel="noreferrer">
              <img className={styles.imgFluid} src={nikita} alt="avatar" />
            </a>
            <div className={styles.teamPanel}>
              <div className={styles.teamHeading}>
                <p className={styles.fullName}>Mikita Karalkou</p>
                <p className={styles.subheading}>
                  Role: <span className={styles.roles}>Team lead</span>
                </p>
                <p className={styles.subheading}>
                  GitHub:{' '}
                  <a className={styles.github} href="https://github.com/huntertigerx" target="_blank" rel="noreferrer">
                    HunterTigerX <GithubOutlined />
                  </a>
                </p>
              </div>
              <div className={styles.teamBody}>
                <p className={styles.textMuted}>
                  I am from Minsk, BSUIR graduate. On the project I implemented a shopping cart, product cards, login
                  page, profile page with the required functionality, wrote jest tests, added products to e-commerce,
                  participated in the development of styles, routing, flow, development of sprints and cards in Jira,
                  installing dependencies and etc.
                </p>
              </div>
            </div>
          </li>
          <li className={`${styles.teamCard} ${styles.teamInverted}`}>
            <a className={styles.teamImage} href="https://github.com/h3nnessey" target="_blank" rel="noreferrer">
              <img className={styles.imgFluid} src="https://avatars.githubusercontent.com/u/87146694?v=4" alt="..." />
            </a>
            <div className={styles.teamPanel}>
              <div className={styles.teamHeading}>
                <p className={styles.fullName}>Vitaly Schneider</p>
                <p className={styles.subheading}>
                  Role: <span className={styles.roles}>API Integration Architect</span>
                </p>
                <p className={styles.subheading}>
                  GitHub:{' '}
                  <a className={styles.github} href="https://github.com/h3nnessey" target="_blank" rel="noreferrer">
                    h3nnessey <GithubOutlined />
                  </a>
                </p>
              </div>
              <div className={styles.teamBody}>
                <p className={styles.textMuted}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam
                  reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore
                  laudantium consectetur!
                </p>
              </div>
            </div>
          </li>
          <li className={styles.teamCard}>
            <a className={styles.teamImage} href="https://github.com/kostik-omsk" target="_blank" rel="noreferrer">
              <img className={styles.imgFluid} src="https://avatars.githubusercontent.com/u/93988894?v=4" alt="..." />
            </a>
            <div className={styles.teamPanel}>
              <div className={styles.teamHeading}>
                <p className={styles.fullName}>Konstantin Sidorenko</p>
                <p className={styles.subheading}>
                  Role: <span className={styles.roles}>Project Visual Identity</span>
                </p>
                <p className={styles.subheading}>
                  GitHub:{' '}
                  <a className={styles.github} href="https://github.com/kostik-omsk" target="_blank" rel="noreferrer">
                    kostik-omsk <GithubOutlined />
                  </a>
                </p>
              </div>
              <div className={styles.teamBody}>
                <p className={styles.textMuted}>
                  Born, attended kindergarten, then school, university, and finally started working. As part of the
                  project, my responsibilities included general work on the creation of components and their design,
                  including the navigation bar, catalog pages, product cards and product filter. I have also developed a
                  registration page and a form, as well as an &quot;About&quot; page.
                </p>
              </div>
            </div>
          </li>
          <li className={`${styles.teamCard} ${styles.teamInverted}`}>
            <a className={styles.teamImage} href="https://rs.school/">
              <img className={styles.imgFluid} src={rss} alt="..." />
            </a>
            <div className={styles.teamPanel}>
              <div className={styles.teamHeading}>
                <p className={styles.fullName}>RS School</p>
              </div>
              <div className={styles.teamBody}>
                <p className={styles.textMuted}>
                  Is free-of-charge and community-based education program conducted by The Rolling Scopes developer
                  community since 2013.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
