itemWithNestedHashkeyArrays = {
  myId : 555,
  nestedArray : [
    {
      $$hashkey: 1,
      a: 10,
      b: 11,
      nestedArray : [
        {
          $$hashkey: 1,
          a: 10,
          b: 11,
          nestedArray : [
            {
              $$hashkey: 1,
              a: 10,
              b: 11
            },
            {
              $$hashkey: 2,
              a: 12,
              b: 13
            }
          ]
        },
        {
          $$hashkey: 2,
          a: 12,
          b: 13,
          nestedArray : [
            {
              $$hashkey: 1,
              a: 10,
              b: 11
            },
            {
              $$hashkey: 2,
              a: 12,
              b: 13
            }
          ]
        }
      ]
    },
    {
      $$hashkey: 2,
      a: 12,
      b: 13,
      nestedArray : [
        {
          $$hashkey: 1,
          a: 10,
          b: 11,
          nestedArray : [
            {
              $$hashkey: 1,
              a: 10,
              b: 11
            },
            {
              $$hashkey: 2,
              a: 12,
              b: 13
            }
          ]
        },
        {
          $$hashkey: 2,
          a: 12,
          b: 13,
          nestedArray : [
            {
              $$hashkey: 1,
              a: 10,
              b: 11
            },
            {
              $$hashkey: 2,
              a: 12,
              b: 13
            }
          ]
        }
      ]
    }
  ]
};

itemWithNestedHashkeysRemoved = {
  myId : 555,
  nestedArray : [
    {
      a: 10,
      b: 11,
      nestedArray : [
        {
          a: 10,
          b: 11,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: 13
            }
          ]
        },
        {
          a: 12,
          b: 13,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: 13
            }
          ]
        }
      ]
    },
    {
      a: 12,
      b: 13,
      nestedArray : [
        {
          a: 10,
          b: 11,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: 13
            }
          ]
        },
        {
          a: 12,
          b: 13,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: 13
            }
          ]
        }
      ]
    }
  ]
};

itemWithNestedDateFields = {
  myId : 555,
  nestedArray : [
    {
      a: new Date("October 13, 2014 11:13:00"),
      b: 11,
      nestedArray : [
        {
          a: 10,
          b: 11,
          nestedArray : [
            {
              a: 10,
              b: new Date("October 13, 2014 11:13:00")
            },
            {
              a: 12,
              b: 13
            }
          ]
        },
        {
          a: 12,
          b: 13,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: new Date("October 13, 2014 11:13:00")
            }
          ]
        }
      ]
    },
    {
      a: new Date("October 13, 2014 11:13:00"),
      b: 13,
      nestedArray : [
        {
          a: 10,
          b: 11,
          nestedArray : [
            {
              a: 10,
              b: 11
            },
            {
              a: 12,
              b: new Date("October 13, 2014 11:13:00")
            }
          ]
        },
        {
          a: 12,
          b: 13,
          nestedArray : [
            {
              a: 10,
              b: new Date("October 13, 2014 11:13:00")
            },
            {
              a: 12,
              b: 13
            }
          ]
        }
      ]
    }
  ]
};