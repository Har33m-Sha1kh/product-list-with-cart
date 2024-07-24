import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isconfirmed, setIsconformed] = useState(false)



  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setAmounts(new Array(data.length).fill(0));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, i) => sum + amounts[i] * items[i].price,
      0
    );
    setTotal(newTotal);
  }, [amounts, cartItems]);

  const addCart = (i) => {
    const newAmounts = [...amounts];
    newAmounts[i] = 1;
    setAmounts(newAmounts);

    if (!cartItems.includes(i)) {
      setCartItems([...cartItems, i]);
    }
  };

  const increment = (i) => {
    const newAmounts = [...amounts];
    newAmounts[i] += 1;
    setAmounts(newAmounts);
  };

  const decrement = (i) => {
    const newAmounts = [...amounts];
    if (newAmounts[i] > 0) {
      newAmounts[i] -= 1;
      setAmounts(newAmounts);
    }
  };

  const ordersPlaced = cartItems.reduce((sum, i) => sum + amounts[i], 0);

  const reset = () => {
    setIsconformed(false);
    setAmounts(amounts.fill(0));
    setCartItems([]);
    setTotal(0);
  }


  return (
    <div className="flex flex-col lg:flex-row lg:justify-between p-8 bg-[#fcf9f7] w-[100vw]">
      {/* food items */}
      <div className="lg:w-2/3">
        <h1 className="font-bold text-3xl mb-12">Desserts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((e, index) => (
            <div key={e.id}>
              <figure className="lg:w-64">
                <img className="w-full rounded-2xl" src={`src/${e.image.tablet}`} alt="" />
                {amounts[index] > 0 ? (
                  <button className="text-white border-[1px] border-gray-500 rounded-full py-2 px-6 flex items-center font-semibold mx-auto translate-y-[-50%] bg-red-600 w-1/2 justify-between">
                    <img onClick={() => decrement(index)} className="border-[1px] border-white rounded-full w-6 h-6 lg:w-4 lg:h-4 p-1" src="src/assets/images/icon-decrement-quantity.svg" alt="decrement" />
                    {amounts[index]}
                    <img onClick={() => increment(index)} className="border-[1px] border-white rounded-full w-6 h-6 lg:w-4 lg:h-4 p-1" src="src/assets/images/icon-increment-quantity.svg" alt="increment" />
                  </button>
                ) : (
                  <button onClick={() => addCart(index)} className="bg-white border-[1px] border-gray-500 rounded-full py-2 justify-center flex items-center font-semibold mx-auto translate-y-[-50%] w-1/2 text-[16px]">
                    <img className="w-1/5 px-1" src="src/assets/images/icon-add-to-cart.svg" alt="cart" /> Add to Cart
                  </button>
                )}
                <figcaption className="my-6">
                  <h2 className="text-gray-600">{e.category}</h2>
                  <p className="font-semibold text-lg">{e.name}</p>
                  <span className="text-red-700 font-bold text-lg">${e.price.toFixed(2)}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* cart */}
      <div className="bg-white rounded-2xl m-4 p-10 h-fit">
        <h1 className="capitalize text-2xl font-bold text-red-700 py-6">your cart ({ordersPlaced})</h1>

        {ordersPlaced>0? 
        <div>
          
          {cartItems.map((e) => (
            amounts[e] > 0 && (
              <div key={e} className="py-2">
                <h1 className="font-semibold py-2">{items[e].name}</h1>
                <span className="text-red-700 font-bold">{amounts[e]}x</span>
                <span className="px-4 text-gray-400">@${items[e].price.toFixed(2)}</span>
                <span className="text-gray-700">${(amounts[e] * items[e].price).toFixed(2)}</span>
                <hr className="mt-8" />
              </div>
            )
          ))}
          <div>
            <div className="flex justify-between py-4">
              <span className="text-gray-600">Order Total</span>
              <span className="font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
            <div className="m-auto bg-[#fcf9f7] flex items-center justify-center p-4 rounded-xl">
              <img className="inline-block" src="src/assets/images/icon-carbon-neutral.svg" alt="carbon" />
              This is <span className="font-bold">&nbsp; carbon-neutral &nbsp;</span> delivery
            </div>
            <button onClick={() => setIsconformed(true)} className="bg-[#c73a0f] text-white w-full my-4 rounded-full p-2">
              Confirm Order
            </button>
          </div>

        </div>: 
        <div>
        <img className="m-auto" src="src\assets\images\illustration-empty-cart.svg" alt="empty cart" />
        <p className="text-red-700 text-center py-4">Your Added Items Will Appear Here.</p>
      </div>}
        
         

      </div>


      {/* confirmation box */}
      {isconfirmed && <div className="fixed h-full w-full top-0 left-0 flex justify-center items-center">
        <div className="bg-white p-4 md:rounded-2xl h-fit w-full sm:w-80 ">
          <img src="src/assets/images/icon-order-confirmed.svg" alt="" />
          <h1 className="font-bold text-3xl py-4">Order Confirmed</h1>
          <p className="text-gray-600 text-md">We hope you enjoy your food</p>
          <div className="my-4 rounded-xl overflow-hidden">
            {cartItems.map((e) => (
              <div key={e} className="bg-[#fcf9f7] p-2 flex justify-between">
                <div className="flex">
                  <img className="w-16 rounded-xl" src={`src/${items[e].image.tablet}`} alt="food" />
                  <div className="mx-4">
                    <h1 className="font-semibold">{items[e].name}</h1>
                    <p className="text-red-700 font-bold">
                      {amounts[e]}x &nbsp;<span className="text-gray-400 font-normal">@${items[e].price}</span>
                    </p>
                  </div>
                </div>
                <div className="font-bold text-xl">${(amounts[e] * items[e].price).toFixed(2)}</div>
                <hr />
              </div>
            ))}
            <div>
              <div className="flex justify-between py-4">
                <span className="text-gray-600">Order Total</span>
                <span className="font-bold text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>


          <button onClick={reset} className="bg-[#c73a0f] text-white w-full my-4 rounded-full p-2">
            Start New Order
          </button>
        </div>

      </div>}
    </div>
  );
}

export default App;
