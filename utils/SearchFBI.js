import axios from "axios";

const handleSearch = async (name) => {
    try {
        const response = await axios.get(`https://api.fbi.gov/wanted/v1/list?title=${name}`);
        const data = response.data;
        let matchFound = false;
        data.items.forEach(item => {
            if (item.title.toLowerCase().includes(name.toLowerCase())) {
                matchFound = true;
            }
        });
        return matchFound ? 1 : 0;
    } catch (error) {
        console.error('Error:', error);
        return 'Chyba při hledání';
    }
};

export default handleSearch;