'use strict';
const { response } = require('express');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListRoom.init({
    id_user: DataTypes.INTEGER,
    id_SecondUser: DataTypes.INTEGER,
    id_lastChat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListRoom',
  });
  return ListRoom;
};


// class ArticleBloc extends Bloc<ArticleEvent, ArticleState>{
//   ArticleBloc() : super(ArticleInitial()){
//     on<GetArticleEvent>((event, emit)async{
//       emit(ArticleLoading());
//       final response = await http.get(Uri.parse(
//         'http:url'
//       ));
//       emit(ArticleSuccess(articles: articlesFromJson(response.body)));
//     })
//   }
// }


// BlocBuilder<ArticleBloc, ArticleState>(
//   builder: (context, state) {
//     if (state is ArticleLoading) {
//       return Center(
//         child: CircularProgressIndicator(),
//       );
//     } else if (state is ArticleSuccess) {
//       final articles = state.articles;

//       return ListView.builder(
//         itemCount: articles.length,
//         itemBuilder: (context, index) {
//           final article = articles[index];

//           //return Listtile diubah jadi BeritaCard
//           return ListTile(
//             title: Text(article.title),
//             subtitle: Text(article.author),
//           );
//         },
//       );
//     } else {
//       return Center(
//         child: Text('Failed to fetch articles'),
//       );
//     }
//   },
// ),