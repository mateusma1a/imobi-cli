import axios from "axios";

export const token = localStorage.getItem("access_token");

export const api = axios.create({
  baseURL:
    process.env.REACT_APP_IMOBI_API_URL ||
    "not found environment variable REACT_APP_IMOBI_API_URL",
  headers: { "x-access-token": token },
});

// login
export const createSession = async (userLogin, userPassword) => {
  return api.post("login/auth/", { userLogin, userPassword });
};

// Company Servie
// Create Company
export const createCompany = async (
  company_type_id,
  company_name,
  main_address,
  telephone,
  email
) => {
  return api.post("company/create/", {
    company_type_id,
    company_name,
    main_address,
    telephone,
    email,
  });
};

// Get All Companies
export const getAllCompanies = async () => {
  return api.get("company/get-all-companies/");
};
// End Company Servie

// User Service
export const createUser = async (
  full_name,
  user_login,
  user_password,
  nickname,
  telephone,
  email,
  company_id
) => {
  return api.post("user/create/", {
    full_name,
    user_login,
    user_password,
    nickname,
    telephone,
    email,
    company_id,
  });
};
// End User Service

// Building Servie
// Create building
export const createBuilding = async (
  registration,
  state,
  city,
  neighborhood,
  street,
  numberAddress,
  address,
  latitude,
  longitude,
  building_type_id,
  evaluation_report_value,
  acquisition_value,
  rent_value,
  sale_value,
  registered_user_id,
  registered_date_time,
  clients_id,
  company_id,
  building_status_type_id
) => {
  return api.post("building/create/", {
    registration,
    state,
    city,
    neighborhood,
    street,
    numberAddress,
    address,
    latitude,
    longitude,
    building_type_id,
    evaluation_report_value,
    acquisition_value,
    rent_value,
    sale_value,
    registered_user_id,
    registered_date_time,
    clients_id,
    company_id,
    building_status_type_id,
  });
};

// Get All Buildings
export const getAllBuildings = async () => {
  return api.get("building/get-all-buildings/");
};
// End Building Servie
