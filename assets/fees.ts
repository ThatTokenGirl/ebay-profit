type Item = {
  sellingPrice: number;
};
type FeeDescription = number | ((item: Item) => number);

const defaultFee = 9.15;

const fees: { [categoryKey: string]: number | ((item: Item) => number) } = {
  Antiques: 9.15,
  Art: 9.15,
  Baby: 9.15,
  Books: 12,
  "Business & Industrial": 9.15,
  "Business & Industrial > Heavy Equipment, Parts & Attachments > Heavy Equipment": 1.5,
  "Business & Industrial > Printing & Graphic Arts > Commercial Printing Presses": 1.5,
  "Business & Industrial > Restaurant & Food Service > Food Trucks, Trailers & Carts": 1.5,
  "Cameras & Photo": 6.15,
  "Cameras & Photo > Camera, Drone & Photo Accessories": 9.15,
  "Cameras & Photo > Camera, Drone & Photo Accessories > Memory Cards": 6.15,
  "Cameras & Photo > Replacement Parts & Tools": 9.15,
  "Cameras & Photo > Tripods & Supports": 9.15,
  "Cameras & Photo > Other Cameras & Photo": 9.15,
  "Clothing, Shoes & Accessories": 9.15,
  "Clothing, Shoes & Accessories > Men > Men's Shoes > Athletic Shoes": ({
    sellingPrice,
  }) => (sellingPrice >= 100 ? 0 : 9.15),
  "Clothing, Shoes & Accessories > Women > Women's Shoes > Athletic Shoes": ({
    sellingPrice,
  }) => (sellingPrice >= 100 ? 0 : 9.15),
  "Coins & Paper Money": 6.15,
  Collectibles: 9.15,
  "Computers/Tablets & Networking": 6.15,
  "Computers/Tablets & Networking > Tablet & eBook Reader Accs > Memory Card & USB Adapters": 6.15,
  "Computers/Tablets & Networking > Desktops & All-In-Ones": 4,
  "Computers/Tablets & Networking > Laptops & Netbooks": 4,
  "Computers/Tablets & Networking > Tablets & eBook Readers": 4,
  "Computers/Tablets & Networking > Computer Components & Parts > CPUs/Processors": 4,
  "Computers/Tablets & Networking > Computer Components & Parts > Memory (RAM)": 4,
  "Computers/Tablets & Networking > Computer Components & Parts > Motherboards": 4,
  "Computers/Tablets & Networking > Computer Components & Parts > Motherboards & CPU combos": 4,
  "Computers/Tablets & Networking > Drives, Storage & Blank Media > Hard Drives (HDD, SDD & NAS)": 4,
  "Computers/Tablets & Networking > Monitors, Projectors & Accessories > Monitors": 4,
  "Computers/Tablets & Networking > Printers, Scanners, & Supplies > Printers": 4,
  "Computers/Tablets & Networking > 3D Printers & Supplies > 3D Printer Consumables": 9.15,
  "Computers/Tablets & Networking > 3D Printers & Supplies > 3D Printer Parts": 9.15,
  "Computers/Tablets & Networking > Computer Cables & Connectors": 9.15,
  "Computers/Tablets & Networking > Keyboards, Mice & Pointers": 9.15,
  "Computers/Tablets & Networking > Laptop & Desktop Accessories": 9.15,
  "Computers/Tablets & Networking > Other Computers & Networking": 9.15,
  "Computers/Tablets & Networking > Power Protection, Distribution": 9.15,
  "Computers/Tablets & Networking > Tablet & eBook Reader Accs": 9.15,
  "Consumer Electronics": 6.15,
  "Consumer Electronics > Multipurpose Batteries & Power": 9.15,
  "Consumer Electronics > Portable Audio & Headphones > Portable Audio Accessories": 9.15,
  "Consumer Electronics > TV, Video & Home Audio > TV, Video & Audio Accessories": 9.15,
  "Consumer Electronics > TV, Video & Home Audio > TV, Video & Audio Parts": 9.15,
  "Consumer Electronics > Vehicle Electronics & GPS > Car Electronics Accessories": 9.15,
  "Consumer Electronics > Vehicle Electronics & GPS > GPS Accessories & Tracking": 9.15,
  "Consumer Electronics > Virtual Reality > Cases, Covers & Skins": 9.15,
  "Consumer Electronics > Virtual Reality > Parts": 9.15,
  "Consumer Electronics > Virtual Reality > Other Virtual Reality Accessories": 9.15,
  Crafts: 9.15,
  "Dolls & Bears": 9.15,
  "DVDs & Movies": 12,
  "Entertainment Memorabilia": 9.15,
  "Gift Cards & Coupons": 9.15,
  "Health & Beauty": 9.15,
  "Home & Garden": 9.15,
  "Jewelry & Watches": 9.15,
  "eBay Motors > Automotive Tools & Supplies": 8.15,
  "eBay Motors > Parts & Accessories": 8.15,
  "eBay Motors > Parts & Accessories > Apparel & Merchandise": 9.15,
  "eBay Motors > Parts & Accessories > In-Car Technology, GPS & Security": 6.15,
  Music: 12,
  "Music > Records": 9.15,
  "Musical Instruments & Gear": 7.15,
  "Musical Instruments & Gear > DJ Equipment": 6.15,
  "Musical Instruments & Gear > Pro Audio Equipment": 6.15,
  "Musical Instruments & Gear > Guitars & Basses": 3.5,
  "Pet Supplies": 9.15,
  "Pottery & Glass": 9.15,
  "Specialty Services": 9.15,
  "Sporting Goods": 9.15,
  "Sports Mem, Cards & Fan Shop": 9.15,
  Stamps: 6.15,
  "Tickets & Experiences": 9.15,
  "Toys & Hobbies": 9.15,
  Travel: 9.15,
  "Video Games & Consoles": 6.15,
  "Video Games & Consoles > Video Game Accessories": 9.15,
  "Video Games & Consoles > Replacement Parts & Tools": 9.15,
  "Video Games & Consoles > Video Games": 9.15,
  "Video Games & Consoles > Video Game Consoles": 4,
};

export function determineFee(item: Item, categoryPath: string[]) {
  let fee = defaultFee;
  let category: string = "";

  for (let i = 0; i < categoryPath.length; i++) {
    category += `${i === 0 ? "" : " > "}${categoryPath[i]}`;
    fee = calculateFactory(fees[category] || fee)(item);
  }

  return fee;
}

function calculateFactory(fee: FeeDescription) {
  return typeof fee === "number" ? () => fee : fee;
}
