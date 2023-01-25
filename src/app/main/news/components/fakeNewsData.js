const profileDB = {
  news: {
    activities: [
      {
        id: '1',
        user: {
          name: 'Alice Freeman',
          avatar: 'assets/images/avatars/alice.jpg',
        },
        message: 'started following you.',
        time: '13 mins. ago',
      },
      {
        id: '2',
        user: {
          name: 'Andrew Green',
          avatar: 'assets/images/avatars/andrew.jpg',
        },
        message: 'sent you a message.',
        time: 'June 10,2015',
      },
      {
        id: '3',
        user: {
          name: 'Garry Newman',
          avatar: 'assets/images/avatars/garry.jpg',
        },
        message: 'shared a public post with your group.',
        time: 'June 9,2015',
      },
      {
        id: '4',
        user: {
          name: 'Carl Henderson',
          avatar: 'assets/images/avatars/carl.jpg',
        },
        message: 'wants to play Fallout Shelter with you.',
        time: 'June 8,2015',
      },
      {
        id: '5',
        user: {
          name: 'Jane Dean',
          avatar: 'assets/images/avatars/jane.jpg',
        },
        message: 'started following you.',
        time: 'June 7,2015',
      },
      {
        id: '6',
        user: {
          name: 'Juan Carpenter',
          avatar: 'assets/images/avatars/james.jpg',
        },
        message: 'sent you a message.',
        time: 'June 6,2015',
      },
      {
        id: '7',
        user: {
          name: 'Judith Burton',
          avatar: 'assets/images/avatars/joyce.jpg',
        },
        message: 'shared a photo with you.',
        time: 'June 5,2015',
      },
      {
        id: '8',
        user: {
          name: 'Vincent Munoz',
          avatar: 'assets/images/avatars/vincent.jpg',
        },
        message: 'shared a photo with you.',
        time: 'June 4,2015',
      },
    ],
    posts: [
      {
        id: '1',
        user: {
          name: 'Garry Newman',
          avatar: 'assets/images/avatars/garry.jpg',
        },
        message: 'Remember the place we were talking about the other night? Found it!',
        time: '32 minutes ago',
        type: 'post',
        like: 5,
        share: 21,
        media: {
          type: 'image',
          preview: 'assets/images/profile/morain-lake.jpg',
        },
        comments: [
          {
            id: '1',
            user: {
              name: 'Alice Freeman',
              avatar: 'assets/images/avatars/alice.jpg',
            },
            time: 'June 10, 2015',
            message:
              'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.',
          },
        ],
      },
      {
        id: '2',
        user: {
          name: 'Andrew Green',
          avatar: 'assets/images/avatars/andrew.jpg',
        },
        message: 'Hey, man! Check this, it’s pretty awesome!',
        time: 'June 12, 2015',
        type: 'article',
        like: 98,
        share: 6,
        article: {
          title: 'Never stop changing!',
          subtitle: 'John Westrock',
          excerpt:
            "John Westrock's new photo album called 'Never stop changing' is published! It features more than 200 photos that will take you right in.",
          media: {
            type: 'image',
            preview: 'assets/images/profile/never-stop-changing.jpg',
          },
        },
        comments: [
          {
            id: '1',
            user: {
              name: 'Alice Freeman',
              avatar: 'assets/images/avatars/alice.jpg',
            },
            time: 'June 10, 2015',
            message:
              'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.',
          },
        ],
      },
      {
        id: '3',
        user: {
          name: 'Carl Henderson',
          avatar: 'assets/images/avatars/carl.jpg',
        },
        message:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...',
        time: 'June 10, 2015',
        type: 'something',
        like: 4,
        share: 1,
      },
    ],
  },
};
export default profileDB;
