import { Case } from './types';

export const STARTER_CASES: Case[] = [
  {
    id: 'starter-1',
    title: 'Case #1: The Missing Acorns 🐿️',
    story: 'Sammy the Silly Squirrel started his morning with 15 crunchy, brown acorns. Soon, his kind sister Sally ran over and gave him 12 more shiny acorns from her secret stash.',
    question: 'How many delicious acorns does Sammy have altogether now? 🌰',
    type: 'addition',
    number1: 15,
    number2: 12,
    correctAnswer: 27,
    operationText: '15 + 12 = 27',
    explanation: 'We want to find out how many acorns Sammy has altogether. Since Sally *gives* him more, we use addition (+)! When we put 15 and 12 together, we get: 15 + 12 = 27 acorns! 🕵️‍♂️✨',
    emoji: '🐿️',
    clue: 'Try counting Sammy\'s first 15 acorns, and then count 12 more! Putting them together is called adding (+)!',
    category: 'squirrels'
  },
  {
    id: 'starter-2',
    title: 'Case #2: The Lost Space Rocks 🚀',
    story: 'Astronaut Mia found 38 glowing cosmic space rocks on the moon. She placed them carefully in her space backpack, but on her walk back to the rocket ship, 14 rocks slipped out of a tiny hole!',
    question: 'How many glowing space rocks does Mia have left in her bag now? ☄️',
    type: 'subtraction',
    number1: 38,
    number2: 14,
    correctAnswer: 24,
    operationText: '38 - 14 = 24',
    explanation: 'Mia had 38 rocks, but she *lost* 14 of them. To find how many are left, we do subtraction (-)! When we take 14 away from 38, we get: 38 - 14 = 24 space rocks! 🕵️‍♂️🛸',
    emoji: '🚀',
    clue: 'When things slip away or are lost, we subtract (-)! Try starting at 38 and taking away 14.',
    category: 'space'
  },
  {
    id: 'starter-3',
    title: 'Case #3: The Baker\'s Secret Trays 🍪',
    story: 'Baker Ben baked 3 metal trays of sweet chocolate-chip cookies. Each tray had exactly 10 warm cookies on it! But oh no, Ben\'s mischievous puppy Pup-Pup snuck into the kitchen and ate 6 cookies while they were cooling!',
    question: 'How many yummy cookies does Baker Ben have left now? 🐶',
    type: 'grouping',
    number1: 3,
    number2: 10,
    number3: 6,
    correctAnswer: 24,
    operationText: '(3 x 10) - 6 = 24',
    explanation: 'Ben had 3 trays of 10 cookies, which is 10 + 10 + 10 = 30 cookies in total. Then, the sneaky puppy ate 6 of them, so we subtract: 30 - 6 = 24 cookies left! 🕵️‍♂️🧁',
    emoji: '🍪',
    clue: 'First, find out how many cookies are on 3 trays of 10 (10 + 10 + 10). Then, subtract (-) the 6 cookies that the puppy ate!',
    category: 'baking'
  }
];

// Helper to generate a new case on the fly
export function generateSimilarCase(type: 'addition' | 'subtraction' | 'mixed' | 'grouping', index: number): Case {
  const categories: Array<'squirrels' | 'space' | 'baking' | 'ocean' | 'toys'> = [
    'squirrels', 'space', 'baking', 'ocean', 'toys'
  ];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const id = `generated-${type}-${Date.now()}-${index}`;

  if (type === 'addition') {
    // Addition within 50
    const n1 = Math.floor(Math.random() * 25) + 10; // 10 to 34
    const n2 = Math.floor(Math.random() * 15) + 5;  // 5 to 19
    const ans = n1 + n2;

    const stories = {
      squirrels: {
        title: `Case of the Acorn Bounty 🐿️`,
        story: `Nutty the chubby squirrel gathered ${n1} acorns in the oak tree. His friend Squeaky found ${n2} more acorns and put them in the same pile.`,
        question: `How many acorns do they have in their pile now? 🌰`,
        clue: `Add (+) the two numbers together to find the grand total!`,
        emoji: '🐿️'
      },
      space: {
        title: `Case of the Alien Stars ⭐`,
        story: `Commander Pip counted ${n1} bright purple stars in Sector Nine. Then, he spotted ${n2} new yellow stars appearing near the nebula.`,
        question: `How many stars can Commander Pip see in total now? 🌌`,
        clue: `When counting all of them together, we add (+)!`,
        emoji: '🌌'
      },
      baking: {
        title: `Case of the Cupcake Party 🧁`,
        story: `Chef Clara baked ${n1} vanilla cupcakes for the school fair. Her assistant baked another ${n2} strawberry cupcakes to add to the table.`,
        question: `How many delicious cupcakes are ready for the fair? 🎂`,
        clue: `Put the vanilla cupcakes and strawberry cupcakes together by adding (+)!`,
        emoji: '🧁'
      },
      ocean: {
        title: `Case of the Coral Reef Shells 🐚`,
        story: `Ollie the Octopus collected ${n1} spiral seashells. A friendly dolphin swam by and gave Ollie ${n2} flat pink seashells.`,
        question: `How many pretty shells does Ollie have in his collection now? 🐙`,
        clue: `Add Ollie\'s seashells and the dolphin\'s seashells together!`,
        emoji: '🐚'
      },
      toys: {
        title: `Case of the Toy Blocks 🧸`,
        story: `Leo has a tall tower made of ${n1} red toy blocks. His sister Lily stacked another ${n2} blue blocks on top without spilling it.`,
        question: `How many toy blocks are in Leo\'s tall tower now? 🗼`,
        clue: `Combine the red blocks and the blue blocks by adding (+)!`,
        emoji: '🧸'
      }
    };

    const details = stories[category];
    return {
      id,
      title: details.title,
      story: details.story,
      question: details.question,
      type: 'addition',
      number1: n1,
      number2: n2,
      correctAnswer: ans,
      operationText: `${n1} + ${n2} = ${ans}`,
      explanation: `We put ${n1} and ${n2} together. Since we are joining them, we use addition (+): ${n1} + ${n2} = ${ans}! Great detective work! 🕵️‍♂️✨`,
      emoji: details.emoji,
      clue: details.clue,
      category
    };
  } else if (type === 'subtraction') {
    // Subtraction within 50
    const n1 = Math.floor(Math.random() * 25) + 20; // 20 to 44
    const n2 = Math.floor(Math.random() * 15) + 5;  // 5 to 19 (making sure n1 - n2 is positive and simple)
    const ans = n1 - n2;

    const stories = {
      squirrels: {
        title: `Case of the Hungry Crow 🐦`,
        story: `Bella the squirrel had ${n1} sweet berries saved on her branch. While she was taking a nap, a cheeky crow flew down and ate ${n2} of them!`,
        question: `How many sweet berries does Bella have left on her branch? 🍓`,
        clue: `When berries are eaten or taken away, we use subtraction (-)!`,
        emoji: '🍓'
      },
      space: {
        title: `Case of the Rocket Fuel 🚀`,
        story: `The silver rocket ship had ${n1} fuel canister batteries. The engine used up ${n2} canisters during its launch into space.`,
        question: `How many fuel canister batteries does the rocket ship have left? 🔋`,
        clue: `Subtract (-) the canisters used by the rocket engine from the starting canisters.`,
        emoji: '🚀'
      },
      baking: {
        title: `Case of the Missing Donuts 🍩`,
        story: `Baker Ben put out a box of ${n1} glazed donuts. A hungry family of hikers walked in and bought ${n2} donuts.`,
        question: `How many sweet glazed donuts are left in Baker Ben's box? 😋`,
        clue: `Find how many are left by taking away (-) the donuts that were sold!`,
        emoji: '🍩'
      },
      ocean: {
        title: `Case of the Swimming Sea Turtles 🐢`,
        story: `There were ${n1} baby sea turtles resting on the warm sand. Then, ${n2} of the turtles crawled into the cool ocean waves.`,
        question: `How many baby sea turtles are still resting on the warm sand? 🏖️`,
        clue: `Subtract (-) the turtles that swam away into the ocean from the total!`,
        emoji: '🐢'
      },
      toys: {
        title: `Case of the Flying Balloons 🎈`,
        story: `Sasha held a big bunch of ${n1} colorful party balloons. When the wind blew hard, ${n2} balloons flew away into the sky.`,
        question: `How many balloons is Sasha still holding in her hand? 🌬️`,
        clue: `Subtract (-) the balloons that flew away from the original bunch!`,
        emoji: '🎈'
      }
    };

    const details = stories[category];
    return {
      id,
      title: details.title,
      story: details.story,
      question: details.question,
      type: 'subtraction',
      number1: n1,
      number2: n2,
      correctAnswer: ans,
      operationText: `${n1} - ${n2} = ${ans}`,
      explanation: `Bella started with ${n1} and lost ${n2}. To find how many are left, we do subtraction (-): ${n1} - ${n2} = ${ans}! Detective case closed! 🕵️‍♂️✨`,
      emoji: details.emoji,
      clue: details.clue,
      category
    };
  } else {
    // Grouping / Mixed
    // Grouping with small numbers or double digit additions/subtractions
    // e.g., 2 boxes of 10 items, plus/minus some
    const boxes = Math.floor(Math.random() * 3) + 2; // 2 or 3 or 4
    const perBox = 10;
    const extraOrAte = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const isAdding = Math.random() > 0.5;

    const totalInBoxes = boxes * perBox;
    const ans = isAdding ? totalInBoxes + extraOrAte : totalInBoxes - extraOrAte;

    const stories = {
      squirrels: {
        title: `Case of the Acorn Boxes 📦`,
        story: `Papa Squirrel packed ${boxes} small boxes of acorns for winter. Each box has exactly 10 premium acorns inside. ${
          isAdding 
            ? `He also found ${extraOrAte} extra loose acorns under a leaf and added them to his pile.`
            : `But a chubby chipmunk snuck in and ate ${extraOrAte} acorns from the stash!`
        }`,
        question: `How many acorns does Papa Squirrel have in total now? 🐿️`,
        clue: `First, add up the acorns in the ${boxes} boxes of 10 (which is ${boxes} groups of 10). Then ${
          isAdding ? `add (+)` : `subtract (-)`
        } the ${extraOrAte} extra ones!`,
        emoji: '🐿️'
      },
      space: {
        title: `Case of the Alien Tentacles 👽`,
        story: `There are ${boxes} small green spaceships flying in formation. Each spaceship has exactly 10 friendly aliens on board. ${
          isAdding
            ? `Then, a tiny shuttle joins them with ${extraOrAte} more aliens.`
            : `During a pit stop, ${extraOrAte} aliens got off to explore a nearby space station.`
        }`,
        question: `How many friendly aliens are there in the group now? 🛸`,
        clue: `First, find how many aliens are in the ${boxes} ships (count by 10s!). Then ${
          isAdding ? `add (+)` : `subtract (-)`
        } the ${extraOrAte} aliens.`,
        emoji: '👽'
      },
      baking: {
        title: `Case of the Cookie Boxes 🍪`,
        story: `Baker Ben boxed up ${boxes} boxes of sweet sugar cookies. Each box fits exactly 10 cookies. ${
          isAdding
            ? `He has ${extraOrAte} extra cookies on the counter that he adds to the order.`
            : `He gave ${extraOrAte} cookies from the boxes away to his delivery driver as a treat.`
        }`,
        question: `How many yummy cookies does Ben have ready for delivery? 🚚`,
        clue: `First, figure out the cookies in the boxes (${boxes} groups of 10). Then ${
          isAdding ? `add (+)` : `subtract (-)`
        } the ${extraOrAte} cookies.`,
        emoji: '🍪'
      },
      ocean: {
        title: `Case of the Sea Star Clusters ⭐`,
        story: `Ollie found ${boxes} starfish families on the sandbars. Each family has exactly 10 starfish. ${
          isAdding
            ? `He then found ${extraOrAte} lone starfish resting on a rock and added them to his map.`
            : `Then, ${extraOrAte} of the starfish swam down deep into the tide pools.`
        }`,
        question: `How many starfish does Ollie have on his map now? 🌊`,
        clue: `First, count the starfish in the families by 10s (${boxes} groups of 10). Then ${
          isAdding ? `add (+)` : `subtract (-)`
        } the ${extraOrAte} ones!`,
        emoji: '🌊'
      },
      toys: {
        title: `Case of the Marble Jars 🔮`,
        story: `Leo has ${boxes} jars of shiny glass marbles. Each jar has exactly 10 marbles in it. ${
          isAdding
            ? `He buys ${extraOrAte} extra marbles from the toy shop to add to his collection.`
            : `He rolls ${extraOrAte} marbles out onto the floor to play a game.`
        }`,
        question: `How many shiny marbles does Leo have in his collection now? ⚽`,
        clue: `First, count the marbles in the ${boxes} jars by 10s. Then ${
          isAdding ? `add (+)` : `subtract (-)`
        } the ${extraOrAte} marbles!`,
        emoji: '🔮'
      }
    };

    const details = stories[category];
    return {
      id,
      title: details.title,
      story: details.story,
      question: details.question,
      type: 'grouping',
      number1: boxes,
      number2: perBox,
      number3: extraOrAte,
      correctAnswer: ans,
      operationText: `${boxes} x 10 ${isAdding ? '+' : '-'} ${extraOrAte} = ${ans}`,
      explanation: `First, we find the total in the boxes: ${boxes} groups of 10 is ${totalInBoxes}. Then, we ${
        isAdding ? `add` : `subtract`
      } ${extraOrAte}: ${totalInBoxes} ${isAdding ? '+' : '-'} ${extraOrAte} = ${ans}. Splendid counting, Detective! 🕵️‍♂️✨`,
      emoji: details.emoji,
      clue: details.clue,
      category
    };
  }
}
