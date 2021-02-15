/**
  355. 设计推特

  设计一个简化版的推特(Twitter)，可以让用户实现发送推文，关注/取消关注其他用户，能够看见关注人（包括自己）的最近十条推文。你的设计需要支持以下的几个功能：
      postTweet(userId, tweetId): 创建一条新的推文
      getNewsFeed(userId): 检索最近的十条推文。每个推文都必须是由此用户关注的人或者是用户自己发出的。推文必须按照时间顺序由最近的开始排序。
      follow(followerId, followeeId): 关注一个用户
      unfollow(followerId, followeeId): 取消关注一个用户

  示例:

  Twitter twitter = new Twitter();

  // 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
  twitter.postTweet(1, 5);

  // 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
  twitter.getNewsFeed(1);

  // 用户1关注了用户2.
  twitter.follow(1, 2);

  // 用户2发送了一个新推文 (推文id = 6).
  twitter.postTweet(2, 6);

  // 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
  // 推文id6应当在推文id5之前，因为它是在5之后发送的.
  twitter.getNewsFeed(1);

  // 用户1取消关注了用户2.
  twitter.unfollow(1, 2);

  // 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
  // 因为用户1已经不再关注用户2.
  twitter.getNewsFeed(1);
 */


function User(id) {
  this.id = id
  this.follows = []
  this.news = []
}

let timestamp = 0

function News(tweetId) {
  this.id = tweetId
  this.timestamp = timestamp
}

/**
 * Initialize your data structure here.
 */
var Twitter = function () {
  this.users = []
};

/**
 * Compose a new tweet. 
 * @param {number} userId 
 * @param {number} tweetId
 * @return {void}
 */
Twitter.prototype.postTweet = function (userId, tweetId) {
  let user = this.users.find(i => i.id === userId)
  if (!user) {
    user = new User(userId)
    this.users.push(user)
  }
  timestamp++
  user.news.push(new News(tweetId))
};

/**
 * Retrieve the 10 most recent tweet ids in the user's news feed.
 * Each item in the news feed must be posted by users who the user followed or by the user herself.
 * Tweets must be ordered from most recent to least recent. 
 * @param {number} userId
 * @return {number[]}
 */
Twitter.prototype.getNewsFeed = function (userId) {
  let user = this.users.find(i => i.id === userId)
  if (!user) {
    this.users.push(new User(userId))
    return []
  }
  let news = [...user.news]
  for (let usrid of user.follows) {
    let _u = this.users.find(i => i.id === usrid)
    if (!_u) continue
    news.push(..._u.news)
  }
  news.sort((a, b) => b.timestamp - a.timestamp)
  news = news.map(i => i.id)
  let set = new Set()
  for (let item of news) {
    set.add(item)
  }
  return Array.from(set).slice(0, 10)
};

/**
 * Follower follows a followee. If the operation is invalid, it should be a no-op. 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.follow = function (followerId, followeeId) {
  let follower = this.users.find(i => i.id === followerId)
  if (!follower) {
    follower = new User(followerId)
    this.users.push(follower)
  }
  follower.follows.push(followeeId)
};

/**
 * Follower unfollows a followee. If the operation is invalid, it should be a no-op. 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.unfollow = function (followerId, followeeId) {
  let follower = this.users.find(i => i.id === followerId)
  if (!follower) {
    follower = new User(followerId)
    this.users.push(follower)
  }
  follower.follows = follower.follows.filter(i => i !== followeeId)
};

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */