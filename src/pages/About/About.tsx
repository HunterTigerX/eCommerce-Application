import AboutUs from '@assets/about.jpg';
import styles from './About.module.css';
import { TeamMember, team } from './dataTeam';
import { TeamMemberCart } from './ui/TeamMemberCart';

const teamList: TeamMember[] = team;

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
          <span className={styles.blueText}>RS School</span>, have led to the creation of an outstanding and functional
          application.
        </p>
        <p className={styles.text}>
          We successfully developed our project using a combination of key technologies and tools.
        </p>
        <ul className={`${styles.techList} ${styles.text}`}>
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
        <p className={styles.text}>
          This effective communication was instrumental in resolving differences and making timely decisions. Together,
          these technologies and tools were pivotal in achieving our project&apos;s success, fostering collaboration,
          and helping us reach our goals.
        </p>
        <h2 className={styles.h2}>Meet the Team:</h2>
        <ul className={styles.team}>
          {teamList && teamList.map((member: TeamMember) => <TeamMemberCart key={member.id} member={member} />)}
        </ul>
      </div>
    </>
  );
};
