# Versioning
There are 2 versions of the API available for use: Version 1 and Version 2.

## Version 1 (soon to be deprecated)
### Requirements
1. Build a server side web api that can be used to fetch products either one at a time or all at once.
2. Every product should have a title, price, and inventory_count.
3. Querying for all products should support passing an argument to only return products with available inventory. 
4. Products should be able to be "purchased" which should reduce the inventory by 1. 
5. Products with no inventory cannot be purchased.

### Endpoints
**GET** `/api/v1/products`
> View all products in the store. 

> Optional Parameter: ?stocked=true

**GET** `/api/v1/products/{sku}`
> View an individual product by SKU.

**PATCH** `/api/v1/products/{sku}`
> Purchase an individual product by SKU.

## Version 2
### Requirements
1. Fit these product purchases into the context of a simple shopping cart. 
2. The cart should contain a list of all included products, a total dollar amount (the total value of all products)
3. Product inventory shouldn't reduce until after a cart has been completed.

### Endpoints
See [documentation](https://documenter.getpostman.com/view/3302275/RzteTCYc)


