const { Op } = require('sequelize');
class APIFeatures {
  constructor(model, query, queryString) {
    this.model = model;
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `[Op.${match}]`,
    ); //g flag --global
    console.log(JSON.parse(queryString));
    //this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    //2: sorting
    //   if (this.queryString.sort) {
    //     const sortBy = this.queryString.sort.split(',').join(' ');
    //     //sort(price ratingsAverage)
    //     this.query = this.query.sort(sortBy);
    //   } else {
    //     this.query = this.query.sort('-createdAt');
    //   }
    //   return this;
    // }
    return this;
  }
  limitField() {
    //3. Field Limiting
    // if (this.queryString.fields) {
    //   //mongoose require field name separated by space.
    //   //query = query.select("name duration price"); -- projecting
    //   const fields = this.queryString.fields.split(',').join(' '); //include mentioned fields
    //   console.log(fields);
    //   this.query = this.query.select(fields);
    // } else {
    //   this.query = this.query.select('-__v'); //- indicates exluding of that filed
    // }
    return this;
  }
  paginate() {
    //4. Pagination
    //page=2&limit=10 means 2 page each having 10 documents 1-10 page 1, 2-20 page 2, 3-30 and so on.
    /*const page = this.queryString.page * 1 || 1; //str to num, by default page 1
      const limit = this.queryString.limit * 1 || 100; //str to num, by default limit = 100
      const skip = (page - 1) * limit; //3rd page then (3-1)*10 we skip 20 value if limit = 10, and get values from 21-30
  
      this.query = this.query.skip(skip).limit(limit); //we skip 10 results to get result 11
      // if(req.query.page){
      //   const numTours = Tours.countDocuments();
      //   if(skip >= numTours) throw new Error("This page does not exist");
      // }*/
    return this;
  }
}
module.exports = APIFeatures;
