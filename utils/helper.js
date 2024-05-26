const {Genre}=require("./constants")


exports.combineWithQueryParam=(filters,name) =>{

    let inputFilter = filters.split(",");
    return inputFilter.map(filter => `&${name}%5B%5D=${filter}`).join('');
}

exports.genreSelector=(genre) =>{

    let inputFilter = genre.split(",");

    let intp = inputFilter.map((gen) => {
      let genreObj = Genre.find(g => g.name === gen.trim());
      return genreObj ? genreObj.id : undefined;
    }).filter(id => id !== undefined); // Remove undefined entries
  
    return intp.map(filter => `genre%5B%5D=${filter}`).join('&');
}
