const fs=require('fs')
const path=require('path')


const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
  );

module.exports=class Cart{
    static addProduct(id,size,price){
        fs.readFile(p,(err, fileContent) => {
            let cart={ products:[], totalPrice:0 };
            if(!err){
                cart= JSON.parse(fileContent)
            }
            let existingProductIndex=cart.products.findIndex(prod=>prod.id===id&&prod.size===size)
            let existingProduct=cart.products[existingProductIndex];

            if(existingProduct && existingProduct.size===size){
                let updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products[existingProductIndex]=updatedProduct;
            }
            else{
                let updatedProduct={id:id, size:size, qty:1};
                cart.products.push(updatedProduct);
            }
            cart.totalPrice+= +price;

            fs.writeFile(p,JSON.stringify(cart),err=>{
                console.log(err);
            })
        })
    }
}