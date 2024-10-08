import { Query } from "mongoose";

class APIFeatures {
    query: Query<any, any>;
    queryString: any;
    constructor(query: Query<any, any>, queryString: any) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = {...this.queryString};
      const excludedFields = ['page', 'limit', 'sort', 'fields'];
      excludedFields.forEach((el: any) => delete queryObj[el]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, matched => `$${matched}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortedBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortedBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
}
  
export default APIFeatures;