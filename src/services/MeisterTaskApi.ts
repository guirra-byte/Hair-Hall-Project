import axios from 'axios';

enum API_STORAGE {
  MIND_MASTER = 'https://www.mindmeister.com/api/v2/',
  MIND_MASTER_ACCESS_TOKEN = 'JO7lerDTKEZyvnG1BjnSy0t-zEPaBJTi9SEfvk9TCLo'
}
//[] - Migrar MIND_MASTER_ACCESS_TOKEN para file .env;
//[] - Após a implementação do ORM Prisma;

const apiMindMaster = async (api_url: string, api_access_token: string) => {

  const apiMindMaster = await axios.get(api_url)
    .then(response => { console.log(response.data) });
}

const {
  MIND_MASTER,
  MIND_MASTER_ACCESS_TOKEN
} = API_STORAGE;


const auxAPI: string = `https://www.mindmeister.com/api/v2/js/api.js?client_id=${MIND_MASTER_ACCESS_TOKEN}`
apiMindMaster(auxAPI, MIND_MASTER_ACCESS_TOKEN);