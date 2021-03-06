import Home from './components/home.vue';
import Projects from './components/projects.vue';
import Misc from './components/misc.vue';
import MiscDetail from './components/misc-detail.vue';
import Info from './components/info.vue';
import Contact from './components/contact.vue';
import Frontend from './components/frontend.vue';
import * as ProjectsComponents from './projects/*.vue';
import * as ProjectsDatas from '../content/projects.json';

//basic routes
let routes = [
  {
    label: 'Home',
    path: '/',
    name: 'home',
    component: Home,
    meta: { transitionTitle: 'gotoAndPlay(0)' }
  },
  {
    label: 'Projects',
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { transitionTitle: 'Projekte' }
  },
  {
    label: 'Misc',
    path: '/misc',
    name: 'misc',
    component: Misc,
    meta: { transitionTitle: 'Kunterbunt' }
  },
  {
    label: 'Misc Detail',
    path: '/misc/:id',
    name: 'misc-detail',
    component: MiscDetail,
    meta: { isNavHidden: true, transitionTitle: '' }
  },
  {
    label: 'Info',
    path: '/info',
    name: 'info',
    component: Info,
    meta: { transitionTitle: 'Info', isDark: false }
  },
  {
    label: 'Contact',
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { transitionTitle: 'Kontakt' }
  },
  {
    label: 'Frontend',
    path: '/frontend',
    name: 'frontend',
    component: Frontend,
    meta: { transitionTitle: 'Frontend' }
  }
];

//dynamically create routes for projects
ProjectsDatas.main.forEach(project => {
  routes.push(
    {
      label: project.uid,
      path: ProjectsDatas.routesPath + project.uid,
      name: 'project-'+project.uid,
      component: ProjectsComponents[project.uid].default,
      meta: { color: project.colorCase, isNavHidden: true }
    }
  );
});

export default routes;
