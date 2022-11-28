function payment(proId) {

    $.ajax({
        url: "/order",
        method: "post",
        data: {
            proId
        },
        success:  (response) => {
                console.log("Reached here");
                razorpayPayment(response);
        },
    });
};


function razorpayPayment(order) {   
    var options = {
        key: "rzp_test_ySng6ZWmNYwGd1", // Enter the Key ID generated from the Dashboard
        amount: order.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Car World",
        description: "Test Transaction",
        image: "https://api.hatchwise.com/api/public/storage/assets/contests/entries/L975725-20170505133348.jpg",
        order_id: order.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        handler: function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
            verifyPayment(response, order);
        },
        prefill: {
            name: "Car World",
            email: "keralaexoticmotor@gmail.com",
            contact: "+91-920-789-562-6",
        },
        notes: {
            address: "Razorpay Corporate Office",
        },
        theme: {
            color: "#d1c286",
        },
    };
    function verifyPayment(payment, order) {
        $.ajax({
            url: "/verifyorder",
            data: {
                payment,
                order,
            },
            method: "post",
            success: (response) => {
                if (response.status) {
                    console.log("worked");
                    location.href = `/ordersuccess/${order.id}`;

                } else {
                    alert("payment failed");
                }
            },
        });
    }
    var rzp1 = new Razorpay(options);
    rzp1.open();
}
