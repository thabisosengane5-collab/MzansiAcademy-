// Quiz banks loaded with the page (deferred) — see index.html.
// GK_QUESTIONS powers Battle Trivia's General Knowledge mode: mixed, fun questions with a
// category tag (cat) and a fun fact (et) shown after each answer.
// The QBANK entries below give five subjects their own questions (they used to borrow Maths).
// Shape matches QBANK: {q, opts, a (index of the correct option), em, et, cat?}.

var GK_QUESTIONS = [
  // ── 🇿🇦 Mzansi facts ──────────────────────────────────────────────────────
  {cat:"Mzansi facts",em:"🇿🇦",q:"How many official languages does South Africa have?",opts:["9","11","12","15"],a:2,et:"South African Sign Language became the 12th official language in 2023."},
  {cat:"Mzansi facts",em:"⚖️",q:"Which city is South Africa's judicial capital?",opts:["Pretoria","Cape Town","Bloemfontein","Johannesburg"],a:2,et:"Pretoria is the executive capital, Cape Town the legislative capital and Bloemfontein the judicial capital — three capitals!"},
  {cat:"Mzansi facts",em:"🗺️",q:"Which is South Africa's largest province by area?",opts:["Limpopo","Northern Cape","Free State","Eastern Cape"],a:1,et:"The Northern Cape covers almost a third of the country but has the fewest people."},
  {cat:"Mzansi facts",em:"🏙️",q:"Which is South Africa's smallest province by area?",opts:["Gauteng","KwaZulu-Natal","Mpumalanga","North West"],a:0,et:"Gauteng is the smallest province but home to about a quarter of all South Africans."},
  {cat:"Mzansi facts",em:"🦌",q:"What is South Africa's national animal?",opts:["Lion","Springbok","Elephant","Kudu"],a:1,et:"The springbok can leap up to about 3.5 m into the air — a move called “pronking”."},
  {cat:"Mzansi facts",em:"🌸",q:"What is South Africa's national flower?",opts:["Bird of paradise","Arum lily","King protea","Sunflower"],a:2,et:"The king protea's flower head can be up to 30 cm wide — bigger than a dinner plate."},
  {cat:"Mzansi facts",em:"🐦",q:"What is South Africa's national bird?",opts:["Fish eagle","Blue crane","Ostrich","Hadeda"],a:1,et:"The blue crane is found almost only in South Africa. (Sorry, hadedas.)"},
  {cat:"Mzansi facts",em:"🐟",q:"Which fish is South Africa's national fish?",opts:["Snoek","Galjoen","Yellowtail","Kingklip"],a:1,et:"The galjoen lives only along southern African coasts, often in rough surf."},
  {cat:"Mzansi facts",em:"⛰️",q:"What is the highest peak in South Africa?",opts:["Table Mountain","Mafadi","Kilimanjaro","Champagne Castle"],a:1,et:"Mafadi, in the Drakensberg on the Lesotho border, is about 3 450 m high."},
  {cat:"Mzansi facts",em:"🌊",q:"What is South Africa's longest river?",opts:["Limpopo","Vaal","Orange (Gariep)","Tugela"],a:2,et:"The Orange River runs more than 2 000 km from the Lesotho highlands to the Atlantic Ocean."},
  {cat:"Mzansi facts",em:"🗻",q:"Which South African landmark is one of the New7Wonders of Nature?",opts:["Table Mountain","Blyde River Canyon","God's Window","Sun City"],a:0,et:"Table Mountain was named one of the New7Wonders of Nature in 2011."},
  {cat:"Mzansi facts",em:"🏔️",q:"Which country is completely surrounded by South Africa?",opts:["Eswatini","Botswana","Lesotho","Namibia"],a:2,et:"Lesotho is entirely surrounded by South Africa, and all of its land is over 1 000 m above sea level."},
  {cat:"Mzansi facts",em:"💵",q:"The rand gets its name from:",opts:["A Dutch coin","The Witwatersrand","A Zulu king","The word “random”"],a:1,et:"The Witwatersrand (“ridge of white waters”) is where gold was found in 1886."},
  {cat:"Mzansi facts",em:"🌟",q:"Which city is known as eGoli, the City of Gold?",opts:["Kimberley","Johannesburg","Pretoria","Polokwane"],a:1,et:"Johannesburg grew from a mining camp after the 1886 gold rush."},
  {cat:"Mzansi facts",em:"❤️",q:"The world's first human heart transplant was done in 1967 in:",opts:["New York","London","Cape Town","Johannesburg"],a:2,et:"Dr Christiaan Barnard led the operation at Groote Schuur Hospital in Cape Town."},
  {cat:"Mzansi facts",em:"🕊️",q:"Who was the first South African to win the Nobel Peace Prize?",opts:["Desmond Tutu","Nelson Mandela","Albert Luthuli","F.W. de Klerk"],a:2,et:"Chief Albert Luthuli won it in 1960 for leading non-violent resistance to apartheid."},
  {cat:"Mzansi facts",em:"💎",q:"The Cullinan, the largest gem-quality rough diamond ever found, was discovered near:",opts:["Kimberley","Pretoria","Durban","Upington"],a:1,et:"Found in 1905 at the Premier Mine near Pretoria, parts of it are in the British Crown Jewels."},
  {cat:"Mzansi facts",em:"🦴",q:"The Cradle of Humankind, where “Mrs Ples” was found, is in:",opts:["Gauteng","Western Cape","Limpopo","Free State"],a:0,et:"The Sterkfontein Caves have produced some of the world's most important early human fossils."},
  {cat:"Mzansi facts",em:"🍵",q:"Rooibos tea grows naturally mainly in which region?",opts:["Drakensberg","Cederberg","Kruger Park","Karoo"],a:1,et:"Rooibos means “red bush” and grows almost only in the Cederberg area of the Western Cape."},
  {cat:"Mzansi facts",em:"🌍",q:"Which ocean washes South Africa's east coast?",opts:["Atlantic","Indian","Pacific","Southern Arctic"],a:1,et:"The warm Indian Ocean is in the east; the cold Atlantic is in the west."},
  {cat:"Mzansi facts",em:"🦁",q:"Which animal is NOT one of the “Big Five”?",opts:["Leopard","Buffalo","Cheetah","Rhino"],a:2,et:"The Big Five are lion, leopard, elephant, rhino and buffalo — named by hunters as the hardest to hunt on foot."},
  {cat:"Mzansi facts",em:"🎂",q:"On which date is Mandela Day celebrated?",opts:["27 April","18 July","24 September","16 December"],a:1,et:"18 July is Nelson Mandela's birthday. People give 67 minutes of service — one for each year he gave to public life."},
  {cat:"Mzansi facts",em:"🔥",q:"Heritage Day (24 September) is also popularly called:",opts:["National Braai Day","Rainbow Day","Ubuntu Day","Springbok Day"],a:0,et:"Many South Africans celebrate their heritage around a fire with family and friends."},
  {cat:"Mzansi facts",em:"🏝️",q:"For how many of his 27 years in prison was Mandela held on Robben Island?",opts:["5","10","18","27"],a:2,et:"He spent 18 years on Robben Island before being moved to Pollsmoor and then Victor Verster prisons."},

  // ── 🗣️ English & languages ───────────────────────────────────────────────
  {cat:"English",em:"📝",q:"Which word is spelt correctly?",opts:["Neccessary","Necessary","Necesary","Neccesary"],a:1,et:"Tip: necessary has one Collar and two Sleeves — one c, two s's."},
  {cat:"English",em:"📝",q:"Which word is spelt correctly?",opts:["Seperate","Separate","Seperete","Separete"],a:1,et:"There's “a rat” in sep-a-rat-e."},
  {cat:"English",em:"✍️",q:"Choose the correct word: “___ going to the match tonight.”",opts:["Their","There","They're","Thier"],a:2,et:"They're = they are. Their = belonging to them. There = a place."},
  {cat:"English",em:"🏊",q:"What is the past tense of “swim”?",opts:["Swimmed","Swam","Swum","Swimming"],a:1,et:"I swim (now), I swam (yesterday), I have swum (perfect tense)."},
  {cat:"English",em:"🔁",q:"Which word is a palindrome (reads the same both ways)?",opts:["Level","Lever","Label","Ladle"],a:0,et:"Other palindromes: racecar, noon, madam — even “never odd or even”."},
  {cat:"English",em:"🤫",q:"“Deafening silence” is an example of a(n):",opts:["Simile","Oxymoron","Alliteration","Pun"],a:1,et:"An oxymoron puts two opposite ideas together, like “bittersweet” or “seriously funny”."},
  {cat:"English",em:"🎭",q:"If someone tells you to “break a leg”, they mean:",opts:["Be careful","Good luck","Run fast","Go home"],a:1,et:"Actors say it before a show because saying “good luck” was thought to be bad luck."},
  {cat:"English",em:"🫘",q:"To “spill the beans” means to:",opts:["Make a mess","Cook supper","Reveal a secret","Waste money"],a:2,et:"Idioms don't mean what the words say — that's what makes them fun."},
  {cat:"English",em:"🌕",q:"Something that happens “once in a blue moon” happens:",opts:["Every month","Very rarely","At night","Every year"],a:1,et:"A “blue moon” is the second full moon in a calendar month — it happens only every two or three years."},
  {cat:"English",em:"🦁",q:"What is a group of lions called?",opts:["A pack","A herd","A pride","A troop"],a:2,et:"A group of crows is called a “murder”, and a group of flamingos a “flamboyance”."},
  {cat:"English",em:"🔤",q:"Which letter is used most often in English?",opts:["A","E","T","S"],a:1,et:"E is the most common letter; Q and Z are among the rarest."},
  {cat:"English",em:"🌸",q:"A haiku is a short poem with how many lines?",opts:["3","5","10","14"],a:0,et:"A haiku traditionally has 5, 7 and 5 syllables. A sonnet has 14 lines."},
  {cat:"English",em:"🎭",q:"Who wrote “Romeo and Juliet”?",opts:["Charles Dickens","William Shakespeare","Jane Austen","Chinua Achebe"],a:1,et:"Shakespeare wrote about 37 plays and invented or popularised words like “eyeball” and “bedroom”."},
  {cat:"English",em:"🚦",q:"In South African English, a “robot” is a:",opts:["Machine","Traffic light","Taxi rank","Cellphone"],a:1,et:"South African English has many unique words: robot, bakkie, braai and “just now”."},
  {cat:"English",em:"⏳",q:"In South Africa, “I'll do it just now” usually means:",opts:["Immediately","In a while","Never","Yesterday"],a:1,et:"“Now now” is sooner than “just now” — confusing for visitors!"},
  {cat:"English",em:"😮",q:"Which antonym is the opposite of “ancient”?",opts:["Old","Modern","Historic","Antique"],a:1,et:"Antonyms are opposites; synonyms have similar meanings."},
  {cat:"Languages",em:"🤝",q:"The Nguni word “ubuntu” is often translated as:",opts:["I am because we are","Welcome home","Good morning","Thank you"],a:0,et:"Ubuntu is the idea that a person is a person through other people — umuntu ngumuntu ngabantu."},
  {cat:"Languages",em:"👋",q:"“Sawubona” is a greeting in which language?",opts:["Afrikaans","isiZulu","Setswana","Tshivenda"],a:1,et:"Sawubona literally means “I see you”. The reply is “Yebo, sawubona”."},
  {cat:"Languages",em:"👋",q:"“Molo” means hello in:",opts:["isiXhosa","Sesotho","Xitsonga","English"],a:0,et:"Molo for one person, Molweni for a group."},
  {cat:"Languages",em:"🙏",q:"“Dankie” means “thank you” in:",opts:["isiNdebele","Afrikaans","Sepedi","siSwati"],a:1,et:"“Baie dankie” means thank you very much."},
  {cat:"Languages",em:"😄",q:"“Lekker”, used all over South Africa, means:",opts:["Lazy","Nice or great","Late","Loud"],a:1,et:"It comes from Afrikaans and is now used by South Africans of every language."},
  {cat:"Languages",em:"👋",q:"“Dumela” is a greeting in:",opts:["Setswana","isiZulu","English","isiXhosa"],a:0,et:"Dumela is used in Setswana and Sesotho (and Sepedi). “Dumelang” greets a group."},

  // ── ⚽ Sport ─────────────────────────────────────────────────────────────
  {cat:"Sport",em:"🏉",q:"How many Rugby World Cups have the Springboks won?",opts:["2","3","4","5"],a:2,et:"1995, 2007, 2019 and 2023 — the most of any country."},
  {cat:"Sport",em:"🏉",q:"Who was the Springboks' first black Test captain?",opts:["Bryan Habana","Siya Kolisi","Makazole Mapimpi","Tendai Mtawarira"],a:1,et:"Siya Kolisi, from Zwide near Gqeberha, lifted the Webb Ellis Cup in 2019 and 2023."},
  {cat:"Sport",em:"⚽",q:"In 2010, South Africa became the first African country to host the:",opts:["Olympic Games","FIFA World Cup","Cricket World Cup","Commonwealth Games"],a:1,et:"Siphiwe Tshabalala scored the tournament's opening goal against Mexico."},
  {cat:"Sport",em:"🏆",q:"Bafana Bafana won the Africa Cup of Nations in:",opts:["1990","1996","2002","2010"],a:1,et:"South Africa hosted and won AFCON in 1996, just after rejoining international football."},
  {cat:"Sport",em:"⚽",q:"Banyana Banyana won the Women's Africa Cup of Nations in:",opts:["2012","2018","2022","2024"],a:2,et:"They beat hosts Morocco in the 2022 final."},
  {cat:"Sport",em:"🏃‍♂️",q:"Wayde van Niekerk broke the 400 m world record at which Olympics?",opts:["London 2012","Rio 2016","Tokyo 2020","Paris 2024"],a:1,et:"He ran 43.03 seconds from lane 8 — he couldn't see any of his rivals."},
  {cat:"Sport",em:"🏊‍♀️",q:"Tatjana Smith (Schoenmaker) won Olympic gold in which event?",opts:["100 m freestyle","200 m breaststroke","400 m medley","Backstroke"],a:1,et:"She won the 200 m breaststroke in Tokyo, setting a world record."},
  {cat:"Sport",em:"🏃",q:"The Comrades Marathon is run between Durban and:",opts:["Pietermaritzburg","Johannesburg","Ladysmith","Richards Bay"],a:0,et:"At about 87–90 km, it's one of the oldest and biggest ultramarathons in the world."},
  {cat:"Sport",em:"⚽",q:"The “Soweto derby” is played between Kaizer Chiefs and:",opts:["Mamelodi Sundowns","Orlando Pirates","Moroka Swallows","AmaZulu"],a:1,et:"It's one of the biggest club matches in Africa, often played in front of huge crowds."},
  {cat:"Sport",em:"🏏",q:"The Proteas are South Africa's national team in:",opts:["Rugby","Cricket","Hockey","Basketball"],a:1,et:"The national netball team is also called the Proteas (the SPAR Proteas)."},
  {cat:"Sport",em:"🏉",q:"How many players does a rugby union team have on the field?",opts:["11","13","15","7"],a:2,et:"Rugby sevens, an Olympic sport, uses 7 players a side; football uses 11."},
  {cat:"Sport",em:"🥅",q:"How many players does a netball team have on court?",opts:["5","7","9","11"],a:1,et:"Each netball player can only move in certain zones of the court."},
  {cat:"Sport",em:"⭕",q:"How many rings are on the Olympic flag?",opts:["4","5","6","7"],a:1,et:"The five rings represent the continents joined together through sport."},
  {cat:"Sport",em:"🏃‍♀️",q:"Caster Semenya won Olympic gold in which event?",opts:["100 m","400 m","800 m","Marathon"],a:2,et:"She won the 800 m at the 2012 and 2016 Olympics."},

  // ── 🎵 Music & culture ────────────────────────────────────────────────────
  {cat:"Music & culture",em:"🎹",q:"Amapiano, the music genre loved worldwide, comes from:",opts:["Nigeria","South Africa","Ghana","Jamaica"],a:1,et:"Amapiano grew in Gauteng townships in the mid-2010s, known for its log-drum bass."},
  {cat:"Music & culture",em:"💃",q:"Which song started a global dance challenge in 2020?",opts:["Jerusalema","Pata Pata","Mbube","Shosholoza"],a:0,et:"Master KG's “Jerusalema”, sung by Nomcebo Zikode, was danced in dozens of countries."},
  {cat:"Music & culture",em:"🎤",q:"Which singer was known as “Mama Africa”?",opts:["Brenda Fassie","Miriam Makeba","Yvonne Chaka Chaka","Lira"],a:1,et:"Miriam Makeba's hit “Pata Pata” made her one of the first African stars known around the world."},
  {cat:"Music & culture",em:"🎺",q:"Hugh Masekela was famous for playing the:",opts:["Guitar","Trumpet","Drums","Piano"],a:1,et:"His song “Bring Him Back Home” became an anthem calling for Mandela's release."},
  {cat:"Music & culture",em:"🏆",q:"Tyla won a Grammy in 2024 for which song?",opts:["Water","Jerusalema","Mnike","Sondela"],a:0,et:"It was the first Grammy awarded for Best African Music Performance."},
  {cat:"Music & culture",em:"🎧",q:"Which South African DJ won a Grammy for the album “Subconsciously”?",opts:["DJ Maphorisa","Black Coffee","Kabza De Small","DJ Sbu"],a:1,et:"Black Coffee won Best Dance/Electronic Album in 2022."},
  {cat:"Music & culture",em:"🎶",q:"Ladysmith Black Mambazo sing in which a cappella style?",opts:["Kwaito","Isicathamiya","Maskandi","Gqom"],a:1,et:"Isicathamiya means “to walk softly” — the singers' tip-toe dance steps match the gentle sound."},
  {cat:"Music & culture",em:"🔊",q:"Gqom, a hard-hitting electronic sound, started in:",opts:["Cape Town","Durban","Bloemfontein","Polokwane"],a:1,et:"Gqom grew from Durban's townships in the early 2010s."},
  {cat:"Music & culture",em:"🎼",q:"Who composed “Nkosi Sikelel' iAfrika”?",opts:["Enoch Sontonga","Solomon Linda","Hugh Masekela","Vusi Mahlasela"],a:0,et:"A teacher, Enoch Sontonga, wrote it in 1897. Today it's part of our national anthem."},
  {cat:"Music & culture",em:"🇿🇦",q:"How many languages are used in the South African national anthem?",opts:["2","3","5","12"],a:2,et:"isiXhosa, isiZulu, Sesotho, Afrikaans and English."},
  {cat:"Music & culture",em:"👢",q:"Gumboot dancing started among:",opts:["Mineworkers","Farmers","Fishermen","Soldiers"],a:0,et:"Miners who weren't allowed to talk underground slapped and stamped their boots to communicate."},
  {cat:"Music & culture",em:"📯",q:"Which plastic horn became famous during the 2010 World Cup?",opts:["Kudu horn","Vuvuzela","Didgeridoo","Shofar"],a:1,et:"Its loud buzz became the sound of South African football."},
  {cat:"Music & culture",em:"🎨",q:"Esther Mahlangu is famous for which art style?",opts:["Ndebele painting","Oil portraits","Graffiti","Pottery"],a:0,et:"In 1991 she painted a BMW Art Car in bold Ndebele patterns."},

  // ── 🍲 Food ───────────────────────────────────────────────────────────────
  {cat:"Food",em:"🍛",q:"Bunny chow — curry in a hollowed-out loaf — comes from which city?",opts:["Durban","Cape Town","Johannesburg","Gqeberha"],a:0,et:"It was created by Durban's Indian community and is now a South African icon."},
  {cat:"Food",em:"🍲",q:"Bobotie is a dish from which South African food tradition?",opts:["Cape Malay","Zulu","Afrikaner braai","Portuguese"],a:0,et:"Spiced mince baked with an egg custard topping — often served with yellow rice."},
  {cat:"Food",em:"🥩",q:"Biltong is:",opts:["A type of bread","Dried, cured meat","A cold drink","A sweet pudding"],a:1,et:"Biltong comes from Dutch words for “buttock” and “strip” — strips of meat dried to last."},
  {cat:"Food",em:"🌶️",q:"Chakalaka is a:",opts:["Spicy vegetable relish","Fried dough ball","Fish stew","Dessert"],a:0,et:"It's said to have started in Johannesburg townships and mines, served with pap and meat."},
  {cat:"Food",em:"🌽",q:"Pap is made from:",opts:["Rice","Maize meal","Potatoes","Sorghum only"],a:1,et:"Stiff pap (phutu, ugali, isitshwala) is a staple across southern Africa."},
  {cat:"Food",em:"🍩",q:"A koeksister is:",opts:["A fried dough soaked in syrup","A sausage","A chicken stew","A kind of tea"],a:0,et:"Cape Malay koesisters are spiced and coconut-covered; Afrikaner koeksisters are plaited and syrupy."},
  {cat:"Food",em:"🐛",q:"Mopane worms are actually:",opts:["Earthworms","Caterpillars","Snakes","Fish"],a:1,et:"They're caterpillars of the emperor moth — high in protein and popular in Limpopo."},
  {cat:"Food",em:"🍞",q:"Amagwinya is another name for:",opts:["Vetkoek","Samp","Boerewors","Rusks"],a:0,et:"Vetkoek means “fat cake” in Afrikaans — the same treat has names in many languages."},
  {cat:"Food",em:"🌭",q:"Boerewors literally means:",opts:["Farmer's sausage","Spicy meat","Long sausage","Braai meat"],a:0,et:"By law, boerewors must be at least 90% meat."},
  {cat:"Food",em:"🍞",q:"A kota is made from:",opts:["A quarter loaf of bread filled with chips and more","A tortilla","Rice and beans","A pancake"],a:0,et:"“Kota” comes from “quarter” — a quarter loaf stuffed with chips, polony, cheese and atchar."},

  // ── 🦁 Nature & animals ───────────────────────────────────────────────────
  {cat:"Nature",em:"🐆",q:"What is the fastest land animal?",opts:["Lion","Cheetah","Springbok","Ostrich"],a:1,et:"A cheetah can reach about 100 km/h — but only for short sprints."},
  {cat:"Nature",em:"🦒",q:"What is the tallest animal on Earth?",opts:["Elephant","Giraffe","Ostrich","Camel"],a:1,et:"A giraffe's neck has just 7 bones — the same number as yours, only much longer."},
  {cat:"Nature",em:"🐧",q:"Where can you watch African penguins on a beach near Cape Town?",opts:["Boulders Beach","Muizenberg","Clifton","Bloubergstrand"],a:0,et:"African penguins are endangered — Boulders Beach protects one of their colonies."},
  {cat:"Nature",em:"🌿",q:"Fynbos is part of which floral kingdom?",opts:["The Cape Floral Kingdom","The Amazon","The Sahara","The Arctic"],a:0,et:"It's the smallest of the world's six floral kingdoms but one of the richest in plant species."},
  {cat:"Nature",em:"🪲",q:"Scientists found that dung beetles navigate at night using:",opts:["The Milky Way","Street lights","The smell of the sea","Sound"],a:0,et:"Researchers at Wits University showed this in 2013 — the first animal known to do it."},
  {cat:"Nature",em:"🌳",q:"Which tree is nicknamed the “upside-down tree”?",opts:["Baobab","Jacaranda","Yellowwood","Marula"],a:0,et:"Baobabs can live for well over 1 000 years. Some in Limpopo are huge."},
  {cat:"Nature",em:"🐟",q:"The “sardine run” happens along which coast?",opts:["KwaZulu-Natal and Eastern Cape","Namaqualand","Western Cape","Mozambique only"],a:0,et:"Each winter, huge shoals of sardines move up the east coast, followed by dolphins, sharks and birds."},
  {cat:"Nature",em:"🐙",q:"How many hearts does an octopus have?",opts:["1","2","3","8"],a:2,et:"Two hearts pump blood to the gills and one to the rest of the body — and its blood is blue."},
  {cat:"Nature",em:"🦏",q:"Rhinos are poached mainly for their:",opts:["Skin","Horns","Teeth","Meat"],a:1,et:"Rhino horn is made of keratin — the same material as your fingernails."},
  {cat:"Nature",em:"🐘",q:"What is the largest land animal?",opts:["African elephant","Hippo","White rhino","Giraffe"],a:0,et:"An African bush elephant can weigh over 6 tonnes."},
  {cat:"Nature",em:"🍯",q:"Which food can last for thousands of years without spoiling?",opts:["Bread","Honey","Milk","Apples"],a:1,et:"Edible honey has been found in ancient Egyptian tombs."},

  // ── 🔬 Science & tech ─────────────────────────────────────────────────────
  {cat:"Science",em:"🫖",q:"Why does water boil below 100 °C in Johannesburg?",opts:["The water is different","Air pressure is lower at high altitude","It's colder","The kettles are stronger"],a:1,et:"At about 1 750 m, water in Johannesburg boils at roughly 94 °C."},
  {cat:"Science",em:"🪐",q:"Which planet is closest to the Sun?",opts:["Venus","Mercury","Mars","Earth"],a:1,et:"But Venus is the hottest planet, because its thick atmosphere traps heat."},
  {cat:"Science",em:"🔴",q:"Which planet is called the Red Planet?",opts:["Jupiter","Mars","Saturn","Neptune"],a:1,et:"Mars looks red because of iron oxide — rust — on its surface."},
  {cat:"Science",em:"🦴",q:"How many bones does an adult human have?",opts:["106","206","306","406"],a:1,et:"Babies are born with around 300 bones; some fuse together as they grow."},
  {cat:"Science",em:"🧍",q:"What is the largest organ of the human body?",opts:["Liver","Brain","Skin","Lungs"],a:2,et:"Your skin completely replaces its outer layer about every month."},
  {cat:"Science",em:"🧂",q:"What is the chemical formula for table salt?",opts:["H₂O","NaCl","CO₂","O₂"],a:1,et:"Sodium chloride: one sodium atom and one chlorine atom."},
  {cat:"Science",em:"☀️",q:"About how long does sunlight take to reach Earth?",opts:["8 seconds","8 minutes","8 hours","8 days"],a:1,et:"About 8 minutes 20 seconds — you always see the Sun as it was 8 minutes ago."},
  {cat:"Science",em:"⚡",q:"Why do we see lightning before we hear thunder?",opts:["Light travels faster than sound","Thunder happens later","Our eyes are faster than ears","Clouds block sound"],a:0,et:"Count the seconds between flash and bang and divide by 3 to estimate the distance in km."},
  {cat:"Science",em:"📡",q:"The MeerKAT radio telescope is in which province?",opts:["Northern Cape","Gauteng","KwaZulu-Natal","Limpopo"],a:0,et:"Its 64 dishes in the Karoo are part of the international Square Kilometre Array project."},
  {cat:"Science",em:"🚀",q:"Who was the first African in space?",opts:["Mark Shuttleworth","Elon Musk","Sindisiwe Mkhize","Patrice Motsepe"],a:0,et:"Mark Shuttleworth flew to the International Space Station in 2002."},
  {cat:"Science",em:"🏥",q:"Allan Cormack, born in Johannesburg, won a Nobel Prize for helping develop the:",opts:["X-ray","CT (CAT) scan","Vaccine","Pacemaker"],a:1,et:"He shared the 1979 Nobel Prize in Medicine for the maths behind CT scanning."},
  {cat:"Science",em:"🌊",q:"The dolos — the concrete block that protects harbours from waves — was invented in:",opts:["East London","Rotterdam","Sydney","Lagos"],a:0,et:"It was developed in East London in 1963. Dolosse now protect harbours around the world."},
  {cat:"Science",em:"🔭",q:"SALT, one of the largest single optical telescopes in the southern hemisphere, is near:",opts:["Sutherland","Stellenbosch","Kimberley","Mthatha"],a:0,et:"Sutherland's dark, dry skies make it one of the best places for astronomy — and the coldest town in SA."},

  // ── 🌍 World ──────────────────────────────────────────────────────────────
  {cat:"World",em:"🌊",q:"What is the largest ocean on Earth?",opts:["Atlantic","Indian","Pacific","Arctic"],a:2,et:"The Pacific is bigger than all the land on Earth put together."},
  {cat:"World",em:"🌍",q:"How many countries are there in Africa?",opts:["44","50","54","60"],a:2,et:"Africa has 54 recognised countries — more than any other continent."},
  {cat:"World",em:"🏔️",q:"What is the highest mountain in Africa?",opts:["Mount Kenya","Kilimanjaro","Mafadi","Mount Elgon"],a:1,et:"Kilimanjaro in Tanzania is about 5 895 m high and has snow near the equator."},
  {cat:"World",em:"💦",q:"Victoria Falls lies on the border of Zambia and:",opts:["Zimbabwe","Botswana","Mozambique","Malawi"],a:0,et:"Its local name, Mosi-oa-Tunya, means “the smoke that thunders”."},
  {cat:"World",em:"👥",q:"Which country has the largest population in the world?",opts:["China","India","USA","Nigeria"],a:1,et:"India overtook China in 2023."},
  {cat:"World",em:"🏜️",q:"What is the largest hot desert in the world?",opts:["Kalahari","Sahara","Namib","Gobi"],a:1,et:"The Sahara is about the size of the USA. (Antarctica is the largest cold desert.)"},
  {cat:"World",em:"🏛️",q:"What is the capital of Nigeria?",opts:["Lagos","Abuja","Accra","Kano"],a:1,et:"Lagos is the biggest city, but Abuja has been the capital since 1991."},
  {cat:"World",em:"🦘",q:"What is the capital of Australia?",opts:["Sydney","Melbourne","Canberra","Perth"],a:2,et:"Canberra was built as a compromise between rivals Sydney and Melbourne."},
  {cat:"World",em:"🔺",q:"The Great Pyramid of Giza is in:",opts:["Sudan","Egypt","Morocco","Ethiopia"],a:1,et:"It was the tallest human-made structure in the world for nearly 4 000 years."},
  {cat:"World",em:"🗺️",q:"How many continents are there?",opts:["5","6","7","8"],a:2,et:"Africa, Antarctica, Asia, Australia (Oceania), Europe, North America and South America."},
  {cat:"World",em:"🏛️",q:"What is the capital of Kenya?",opts:["Mombasa","Nairobi","Kampala","Dodoma"],a:1,et:"Nairobi has a national park with lions and giraffes right next to the city."},

  // ── 📜 History ────────────────────────────────────────────────────────────
  {cat:"History",em:"🦏",q:"Which famous golden object was found at Mapungubwe?",opts:["A golden rhino","A golden crown","A golden shield","A golden spear"],a:0,et:"The golden rhino is about 800 years old and a symbol of a wealthy African kingdom."},
  {cat:"History",em:"🏛️",q:"The country Zimbabwe is named after:",opts:["A river","Great Zimbabwe, a stone city","A king","A mountain"],a:1,et:"“Zimbabwe” comes from Shona words meaning “houses of stone”."},
  {cat:"History",em:"✊",q:"Which day remembers the 1976 Soweto student uprising?",opts:["Freedom Day","Youth Day","Heritage Day","Workers' Day"],a:1,et:"On 16 June 1976, learners marched against Afrikaans being forced on them at school."},
  {cat:"History",em:"👩",q:"Women's Day on 9 August remembers a 1956 march to:",opts:["Parliament","The Union Buildings","Robben Island","Sharpeville"],a:1,et:"About 20 000 women marched against pass laws: “Wathint' abafazi, wathint' imbokodo.”"},
  {cat:"History",em:"🗳️",q:"South Africa's first democratic election was held in:",opts:["1990","1992","1994","1996"],a:2,et:"27 April 1994 — now Freedom Day."},
  {cat:"History",em:"👴",q:"Nelson Mandela's clan name, used with respect, is:",opts:["Tata","Madiba","Rolihlahla","Khulu"],a:1,et:"His birth name, Rolihlahla, can be translated as “pulling the branch of a tree” — or “troublemaker”."},
  {cat:"History",em:"✊🏾",q:"Steve Biko is best known for leading the:",opts:["Defiance Campaign","Black Consciousness Movement","Freedom Charter","TRC"],a:1,et:"His message was “Black is beautiful” — pride and self-reliance."},

  // ── 🧠 Money & brain teasers ──────────────────────────────────────────────
  {cat:"Money",em:"🧾",q:"What is the VAT rate in South Africa?",opts:["10%","14%","15%","20%"],a:2,et:"Some basic foods, like brown bread and maize meal, are zero-rated (0% VAT)."},
  {cat:"Money",em:"💵",q:"Whose face appears on the front of South African banknotes?",opts:["Nelson Mandela","Desmond Tutu","Oliver Tambo","Albert Luthuli"],a:0,et:"The back of the notes shows the Big Five animals."},
  {cat:"Money",em:"🏷️",q:"A R200 jacket is on sale at 25% off. What do you pay?",opts:["R50","R150","R175","R125"],a:1,et:"25% of R200 is R50, so you pay R150."},
  {cat:"Money",em:"🤝",q:"A stokvel is a:",opts:["Type of shoe","Savings club","Bank loan","Taxi route"],a:1,et:"Millions of South Africans save together in stokvels — a tradition worth billions of rands."},
  {cat:"Brain teaser",em:"🎹",q:"What has keys but can't open locks?",opts:["A door","A piano","A car","A map"],a:1,et:"Riddles test lateral thinking — looking at a problem from an unexpected angle."},
  {cat:"Brain teaser",em:"🐑",q:"A farmer has 17 sheep. All but 9 run away. How many are left?",opts:["8","9","17","0"],a:1,et:"“All but 9” means 9 stayed. Read the question carefully!"},
  {cat:"Brain teaser",em:"📅",q:"How many months have 28 days?",opts:["1","2","6","12"],a:3,et:"Every month has at least 28 days."},
  {cat:"Brain teaser",em:"🏃",q:"In a race, you overtake the person in 2nd place. What place are you in now?",opts:["1st","2nd","3rd","Last"],a:1,et:"You took their place — 2nd, not 1st."},
  {cat:"Brain teaser",em:"🔢",q:"What comes next: 2, 4, 8, 16, …?",opts:["18","24","32","64"],a:2,et:"Each number doubles: 16 × 2 = 32."},
  {cat:"Brain teaser",em:"🥖",q:"How many is a “baker's dozen”?",opts:["10","12","13","14"],a:2,et:"Bakers once added an extra loaf so they couldn't be accused of selling short."},
  {cat:"Brain teaser",em:"⏱️",q:"How many seconds are there in one hour?",opts:["360","600","3 600","6 000"],a:2,et:"60 seconds × 60 minutes = 3 600 seconds."},
];

// ── Subject banks for subjects that used to borrow the Maths questions ────────
QBANK.math_lit = [
  {q:"A pair of sneakers costs R800 with 20% off. What do you pay?",opts:["R160","R640","R780","R960"],a:1,em:"👟",et:"20% of R800 = R160 → R800 − R160 = R640."},
  {q:"Prices in South Africa usually include VAT at:",opts:["10%","14%","15%","20%"],a:2,em:"🧾",et:"Price excl. VAT × 1.15 = price incl. VAT."},
  {q:"An item costs R100 before VAT. Its price including 15% VAT is:",opts:["R100","R115","R150","R85"],a:1,em:"🧾",et:"100 × 1.15 = R115."},
  {q:"A taxi fare rises from R20 to R25. The percentage increase is:",opts:["5%","20%","25%","50%"],a:2,em:"🚐",et:"(25 − 20) ÷ 20 × 100 = 25%."},
  {q:"On a 1 : 50 000 map, 2 cm represents:",opts:["100 m","1 km","10 km","50 km"],a:1,em:"🗺️",et:"2 × 50 000 cm = 100 000 cm = 1 km."},
  {q:"You flip a coin. The probability of heads is:",opts:["0","0.25","0.5","1"],a:2,em:"🪙",et:"1 favourable outcome out of 2 possible outcomes."},
  {q:"Mix juice in the ratio 1 : 4 (concentrate : water) to make 2.5 L. How much concentrate?",opts:["250 ml","500 ml","625 ml","2 L"],a:1,em:"🧃",et:"5 parts → 2 500 ml ÷ 5 = 500 ml."},
  {q:"R5 000 earns 10% simple interest per year. Interest after 3 years?",opts:["R500","R1 000","R1 500","R6 500"],a:2,em:"🏦",et:"5 000 × 0.10 × 3 = R1 500."},
  {q:"A stokvel has 12 members who each pay R500 a month. How much is collected each month?",opts:["R500","R5 000","R6 000","R12 000"],a:2,em:"🤝",et:"12 × R500 = R6 000."},
  {q:"A car uses 7 litres per 100 km. How much fuel for a 300 km trip?",opts:["14 L","21 L","30 L","70 L"],a:1,em:"⛽",et:"300 ÷ 100 × 7 = 21 litres."},
  {q:"A recipe for 4 people uses 2 cups of rice. How much for 10 people?",opts:["4 cups","5 cups","6 cups","8 cups"],a:1,em:"🍚",et:"10 ÷ 4 = 2.5 → 2.5 × 2 = 5 cups."},
  {q:"What is the median of 3, 7, 9, 12, 20?",opts:["7","9","10.2","12"],a:1,em:"📊",et:"The middle value of the ordered list is 9. (The mean is 10.2.)"},
  {q:"A geyser uses 3 kW for 2 hours. How many units (kWh) is that?",opts:["1.5","5","6","32"],a:2,em:"💡",et:"kWh = kW × hours = 3 × 2 = 6."},
  {q:"A room is 4 m by 3 m. Its floor area is:",opts:["7 m²","12 m²","14 m²","24 m²"],a:1,em:"📐",et:"Area = length × breadth = 4 × 3 = 12 m²."},
  {q:"The exchange rate is R18 per US$. How many rand is US$50?",opts:["R68","R360","R900","R1 800"],a:2,em:"💱",et:"50 × 18 = R900."},
];

QBANK.afrikaans = [
  {q:"What does “Baie dankie” mean?",opts:["Good morning","Thank you very much","Goodbye","Please"],a:1,em:"🙏",et:"“Baie” means very or many; “dankie” means thank you."},
  {q:"“Goeie môre” means:",opts:["Good night","Good afternoon","Good morning","See you tomorrow"],a:2,em:"🌅",et:"“Môre” means both morning and tomorrow — context tells you which."},
  {q:"Which word means “yesterday”?",opts:["Vandag","Môre","Gister","Nou"],a:2,em:"📅",et:"Gister (yesterday), vandag (today), môre (tomorrow)."},
  {q:"Translate: “Ek hou van musiek.”",opts:["I play music","I like music","I hear music","I hate music"],a:1,em:"🎵",et:"“Hou van” means “like” — Ek hou van sokker (I like soccer)."},
  {q:"Afrikaans uses a double negative. Which sentence is correct?",opts:["Ek is nie moeg.","Ek is nie moeg nie.","Ek nie is moeg.","Nie ek is moeg."],a:1,em:"🚫",et:"Negative sentences often end with a second “nie”: Ek is nie moeg nie."},
  {q:"Put into the past tense: “Ek speel sokker.”",opts:["Ek het sokker gespeel.","Ek sal sokker speel.","Ek speel gister sokker.","Ek gespeel sokker."],a:0,em:"⚽",et:"Past tense: het + ge- + verb (at the end): Ek het sokker gespeel."},
  {q:"Put into the future tense: “Ons eet pap.”",opts:["Ons het pap geëet.","Ons sal pap eet.","Ons eet pap gister.","Ons geëet pap."],a:1,em:"🍲",et:"Future tense uses “sal”: Ons sal pap eet."},
  {q:"What is the diminutive (small form) of “hond” (dog)?",opts:["Honde","Hondjie","Hondtjie","Hondkie"],a:1,em:"🐶",et:"Diminutives use -ie, -jie, -tjie, -pie or -kie: hondjie, katjie, boompie."},
  {q:"The plural of “boek” is:",opts:["Boeks","Boeke","Boekies","Boekens"],a:1,em:"📚",et:"Most plurals add -e or -s: boeke, karre, ooms."},
  {q:"“Die” in Afrikaans means:",opts:["Die (as in death)","The","This","A"],a:1,em:"🔤",et:"Afrikaans has one definite article, “die”, and one indefinite article, “'n”."},
  {q:"Which day is “Woensdag”?",opts:["Monday","Tuesday","Wednesday","Thursday"],a:2,em:"🗓️",et:"Maandag, Dinsdag, Woensdag, Donderdag, Vrydag, Saterdag, Sondag."},
  {q:"Afrikaans became an official language of South Africa in:",opts:["1652","1875","1925","1994"],a:2,em:"📜",et:"In 1925 Afrikaans replaced Dutch as an official language."},
  {q:"The Afrikaans Language Monument stands near:",opts:["Paarl","Pretoria","Durban","Kimberley"],a:0,em:"🗿",et:"The monument (Taalmonument) on Paarl Mountain opened in 1975."},
  {q:"Which word means “beautiful”?",opts:["Lelik","Mooi","Groot","Vinnig"],a:1,em:"🌸",et:"Mooi (beautiful), lelik (ugly), groot (big), vinnig (fast)."},
  {q:"In “Ek gaan môre skool toe”, the verb “gaan” comes:",opts:["First","Second","Last","It's left out"],a:1,em:"🧩",et:"In main clauses the verb is in second position — STOMPI helps you order the rest."},
];

QBANK.isizulu = [
  {q:"“Sawubona” means:",opts:["Goodbye","Hello (to one person)","Thank you","Yes"],a:1,em:"👋",et:"To greet a group, say “Sanibonani”."},
  {q:"How do you say “thank you” in isiZulu?",opts:["Yebo","Ngiyabonga","Hamba kahle","Cha"],a:1,em:"🙏",et:"“Ngiyabonga kakhulu” means thank you very much."},
  {q:"“Yebo” means:",opts:["No","Yes","Maybe","Hello"],a:1,em:"✅",et:"Yebo (yes), cha (no)."},
  {q:"You are leaving; the person staying behind says to you:",opts:["Sala kahle","Hamba kahle","Sawubona","Ngiyabonga"],a:1,em:"🚶",et:"“Hamba kahle” (go well) is said to the one leaving; “sala kahle” (stay well) to the one staying."},
  {q:"“Umama” means:",opts:["Father","Mother","Grandmother","Sister"],a:1,em:"👩",et:"Umama (mother), ubaba (father), ugogo (grandmother), umkhulu (grandfather)."},
  {q:"What is the plural of “umuntu” (person)?",opts:["Imintu","Abantu","Izintu","Amantu"],a:1,em:"👥",et:"Class 1/2 nouns: umu- → aba-, e.g. umfundi → abafundi (learners)."},
  {q:"What is the plural of “inja” (dog)?",opts:["Izinja","Abanja","Imija","Amanja"],a:0,em:"🐕",et:"Class 9/10 nouns often change in- to izin-: inja → izinja."},
  {q:"“Umuntu ngumuntu ngabantu” means:",opts:["A person is a person through other people","People must work hard","Respect your elders","Home is best"],a:0,em:"🤝",et:"This proverb expresses ubuntu."},
  {q:"Which day is “uMsombuluko”?",opts:["Sunday","Monday","Friday","Saturday"],a:1,em:"🗓️",et:"uMsombuluko (Mon), uLwesibili (Tue), uLwesithathu (Wed), uLwesine (Thu), uLwesihlanu (Fri), uMgqibelo (Sat), iSonto (Sun)."},
  {q:"“Kubili” is the number:",opts:["1","2","3","4"],a:1,em:"🔢",et:"Kunye (1), kubili (2), kuthathu (3), kune (4), kuhlanu (5)."},
  {q:"The letters c, q and x in isiZulu represent:",opts:["Silent letters","Click sounds","Vowels","Tones"],a:1,em:"👅",et:"c is a dental click, q a palatal (alveolar) click and x a lateral click."},
  {q:"“-bomvu” describes which colour?",opts:["Blue","Red","Black","White"],a:1,em:"🎨",et:"-bomvu (red), -mnyama (black), -mhlophe (white), -luhlaza (blue/green)."},
  {q:"isiZulu is the most widely spoken home language in South Africa. About what share of people speak it at home?",opts:["About 5%","About 10%","About 25%","About 50%"],a:2,em:"📊",et:"Census 2022 found roughly a quarter of South Africans speak isiZulu at home."},
  {q:"“Ngiyakuthanda” means:",opts:["I am hungry","I love you","I am going","I don't know"],a:1,em:"❤️",et:"Ngi- (I) + -ya- + -ku- (you) + -thanda (love)."},
  {q:"“Isikole” means:",opts:["Church","School","Shop","Hospital"],a:1,em:"🏫",et:"Many isiZulu words are borrowed and adapted: isikole (school), ibhasi (bus), ifoni (phone)."},
];

QBANK.technology = [
  {q:"Which force squeezes or pushes a material together?",opts:["Tension","Compression","Torsion","Shear"],a:1,em:"🧱",et:"Tension pulls apart, compression squeezes, torsion twists, shear slides layers past each other."},
  {q:"Why are triangles used in roof trusses and bridges?",opts:["They look nice","They are rigid and don't change shape easily","They use more material","They're cheaper to paint"],a:1,em:"🔺",et:"Triangulation makes a frame structure strong and stable."},
  {q:"A wheelbarrow is an example of which class of lever?",opts:["Class 1","Class 2","Class 3","It's not a lever"],a:1,em:"🛒",et:"In a class 2 lever, the load is between the fulcrum (wheel) and the effort (handles)."},
  {q:"A seesaw is a class 1 lever because:",opts:["The fulcrum is in the middle","The load is in the middle","The effort is in the middle","It has wheels"],a:0,em:"⚖️",et:"Class 1: fulcrum between effort and load (scissors, crowbar)."},
  {q:"A driver gear has 10 teeth and the driven gear has 30. The gear ratio is:",opts:["1 : 3","3 : 1","10 : 1","1 : 1"],a:1,em:"⚙️",et:"Ratio = driven ÷ driver = 30 ÷ 10 = 3 : 1 — the output turns slower but with more force."},
  {q:"A shell structure — like an egg or a car body — gets its strength from:",opts:["A frame of beams","Its curved outer surface","Its weight","Ropes"],a:1,em:"🥚",et:"Frame structures use beams; shell structures use a strong outer skin; solid structures use mass (e.g. a dam wall)."},
  {q:"The Nelson Mandela Bridge in Johannesburg is a:",opts:["Suspension bridge","Cable-stayed bridge","Arch bridge","Beam bridge"],a:1,em:"🌉",et:"Its cables run straight from the pylons to the deck. It opened in 2003."},
  {q:"In a series circuit, if one bulb blows:",opts:["The others stay on","All the bulbs go off","The others get brighter","Nothing changes"],a:1,em:"💡",et:"There's only one path for current in series; parallel circuits have several paths."},
  {q:"Ohm's law states that V =",opts:["I ÷ R","I × R","R ÷ I","I + R"],a:1,em:"🔌",et:"Voltage = current × resistance. 2 A through 6 Ω needs 12 V."},
  {q:"What is the first step of the design process?",opts:["Make","Evaluate","Investigate","Communicate"],a:2,em:"🧭",et:"Investigate → design → make → evaluate → communicate (IDMEC)."},
  {q:"A pulley system mainly helps to:",opts:["Make things heavier","Change the direction of force or reduce effort","Store electricity","Measure weight"],a:1,em:"🏗️",et:"Cranes and flagpoles use pulleys."},
  {q:"Which material is the best electrical conductor?",opts:["Plastic","Wood","Copper","Rubber"],a:2,em:"🔋",et:"Copper conducts well, which is why it's used in wires — and why cable theft is so common."},
  {q:"A hydraulic system uses:",opts:["Compressed air","A liquid under pressure","Electricity only","Gears"],a:1,em:"🚜",et:"Hydraulics (liquids) power car brakes and excavators; pneumatics use compressed air."},
  {q:"Twisting a bottle cap applies which force?",opts:["Tension","Compression","Torsion","Bending"],a:2,em:"🍾",et:"Torsion is a twisting force."},
  {q:"A system has input, process and:",opts:["Output","Gear","Battery","Design"],a:0,em:"🔁",et:"Example: a kettle — input (electricity), process (heating), output (boiling water)."},
];

QBANK.arts = [
  {q:"The three primary colours in painting are:",opts:["Red, yellow, blue","Red, green, blue","Orange, green, purple","Black, white, grey"],a:0,em:"🎨",et:"Mixing two primaries makes a secondary colour: red + yellow = orange."},
  {q:"The complementary colour of blue is:",opts:["Green","Orange","Purple","Yellow"],a:1,em:"🔵",et:"Complementary colours sit opposite each other on the colour wheel and make each other stand out."},
  {q:"Which is a warm colour?",opts:["Blue","Green","Orange","Purple"],a:2,em:"🔥",et:"Warm colours (red, orange, yellow) seem to come forward; cool colours seem to recede."},
  {q:"Which artist painted a BMW Art Car in Ndebele patterns in 1991?",opts:["Esther Mahlangu","Irma Stern","Gerard Sekoto","William Kentridge"],a:0,em:"🚗",et:"Esther Mahlangu's bold geometric style is known around the world."},
  {q:"William Kentridge is famous for animated films made with:",opts:["Clay","Charcoal drawings","Sand","Lego"],a:1,em:"✏️",et:"He draws, erases and redraws in charcoal, filming each change."},
  {q:"The oldest art in South Africa includes:",opts:["Oil paintings","San rock art","Photographs","Murals in malls"],a:1,em:"🪨",et:"San rock paintings in the Drakensberg and Cederberg can be thousands of years old."},
  {q:"In perspective drawing, parallel lines meet at the:",opts:["Horizon point","Vanishing point","Focal point","End point"],a:1,em:"🛤️",et:"One-point perspective makes a road or railway look like it disappears into the distance."},
  {q:"Which is NOT an element of art?",opts:["Line","Texture","Colour","Budget"],a:3,em:"🧩",et:"The elements are line, shape, form, colour, value, texture and space."},
  {q:"Zeitz MOCAA, a major museum of contemporary African art, is in a converted:",opts:["Grain silo","Prison","Railway station","Church"],a:0,em:"🏛️",et:"It opened in 2017 at the V&A Waterfront in Cape Town."},
  {q:"Who painted the Mona Lisa?",opts:["Michelangelo","Leonardo da Vinci","Picasso","Van Gogh"],a:1,em:"🖼️",et:"Leonardo was also an inventor, engineer and scientist."},
  {q:"Pablo Picasso helped start which art movement?",opts:["Impressionism","Cubism","Pop Art","Realism"],a:1,em:"🟦",et:"Cubism shows objects from several viewpoints at once, using geometric shapes."},
  {q:"Mixing a colour with white makes a:",opts:["Shade","Tint","Tone","Hue"],a:1,em:"⚪",et:"Add white → tint; add black → shade; add grey → tone."},
  {q:"Mary Sibande's sculptures feature a character named:",opts:["Sophie","Lerato","Thandi","Naledi"],a:0,em:"👗",et:"Sophie, often dressed in a domestic worker's uniform turned into a grand gown, explores identity and history."},
  {q:"Zanele Muholi is internationally known for:",opts:["Photography","Pottery","Architecture","Fashion design"],a:0,em:"📷",et:"Muholi calls themself a visual activist, documenting Black LGBTQIA+ lives."},
  {q:"Which principle of design creates a sense of movement by repeating elements?",opts:["Rhythm","Balance","Contrast","Unity"],a:0,em:"🔁",et:"Principles: balance, contrast, emphasis, rhythm, movement, proportion, unity."},
];

// Shuffle each question's options once per page load so the right answer isn't always in
// the same position (online battles store the shuffled questions, so all players match).
function _shuffleOpts(q){
  var right=q.opts[q.a], o=q.opts.slice();
  for(var i=o.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=o[i]; o[i]=o[j]; o[j]=t; }
  q.opts=o; q.a=o.indexOf(right);
}
GK_QUESTIONS.forEach(_shuffleOpts);
['math_lit','afrikaans','isizulu','technology','arts'].forEach(function(k){ QBANK[k].forEach(_shuffleOpts); });
