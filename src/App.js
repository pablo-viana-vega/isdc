import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
/* import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import CreateProject from "./components/CreateProject";
import EditProject from "./components/EditProject";
import ListUser from './components/ListUser';
import CreateTable from './components/CreateTable'; */
import AboutUs from "./routes/aboutus";
import Login from "../src/routes/login";
import Register from "../src/routes/register";
import Home from "../src/routes/home";
import UserPanel from "./components/user-panel";
import PassRec from "./components/password-recovery";
import CreateProjectForm from "./components/createProjectForm";
import CreateUser from "./components/CreateUser";
import CreateUserAT from "./components/CreateUserAT";
import ProjectDetails from "./components/projectDetails";
import EditProjectForm from "./components/EditProjectForm";
import UserFilter from "./components/searchUsers";
import ProjectList from "./components/projectList";
import SendProject from "./components/sendProject";
import ProjectListAll from "./components/projectListAll";
import ProjectListUf from "./components/projectListUf";
import MyProjectDetails from "./components/myProjectDetails";
import EditUserForm from "./components/EditUserForm";
import ProjectFilter from "./components/searchProjects";
import ProjectFilterPanel from "./components/searchProjectsPanel";
import ProjectDetailsSearch from "./components/projectDetailsSearch";
import ProjectDetailsUf from "./components/projectDetailsUf";
import PdfPage from "./components/pdfPage";
import EditUserFormAdm from "./components/EditUserFormAdm";
import PublicPanel from "./components/public-panel";

function App() {
  return (
    <div className="App  w-full ">
      <div className="bg-zoom w-full space-between bg-no-repeat bg-center bg-cover top-0 left-0 overflow-y-visible z-0 flex flex-col">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="aboutus" element={<AboutUs />} />

            <Route path="userpanel" element={<UserPanel />} />
            <Route path="publicpanel" element={<PublicPanel />} />
            <Route path="password-recovery" element={<PassRec />} />
            <Route path="create-project" element={<CreateProjectForm />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="create-user-at" element={<CreateUserAT />} />
            <Route path="project-details/:id" element={<ProjectDetails />} />
            <Route
              path="my-project-details/:id"
              element={<MyProjectDetails />}
            />
            <Route
              path="project-details-search/:pid/:uid"
              element={<ProjectDetailsSearch />}
            />
            <Route
              path="project-details-uf/:id"
              element={<ProjectDetailsUf />}
            />
            <Route path="/project/edit/:id" element={<EditProjectForm />} />
            <Route path="/project_list" element={<ProjectList />} />
            <Route path="/project_list_uf" element={<ProjectListUf />} />
            <Route path="/project_list_all" element={<ProjectListAll />} />
            <Route path="/send_project" element={<SendProject />} />
            <Route path="/edit_user" element={<EditUserForm />} />
            <Route path="/edit_user_adm/:id" element={<EditUserFormAdm />} />
            {/*   <Route path="/edit_user_search" element={<EditUserSearchForm />} /> */}
            <Route path="/search" element={<ProjectFilter />} />
            <Route path="/search-user" element={<UserFilter />} />

            <Route path="/search-panel" element={<ProjectFilterPanel />} />
            <Route path="/pdf-page/:id" element={<PdfPage />} />

            {/* <Route path="user/create" element={<CreateUser />} />
            <Route path="user/:id/edit" element={<EditUser />} />
            <Route path="user/:id/project/create" />
            <Route path="user/:id/project/edit" />
            <Route path="user/:id/project/delete" /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
