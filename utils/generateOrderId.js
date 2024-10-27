function generateOrderNumber() {
    const now = new Date();
    
    // Get year, month, day, hours, minutes, seconds
    const year = now.getFullYear().toString().slice(-2); // last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    // Generate a random 4-digit sequence
    const randomSequence = Math.floor(1000 + Math.random() * 9000).toString(); 
  
    // Combine everything into an order ID (e.g., "23-10-19-1453-8256")
    const orderId = `${year}${month}${day}-${hours}${minutes}${seconds}-${randomSequence}`;
  
    return orderId;
  }


  module.exports = {
    generateOrderNumber,
  };
  