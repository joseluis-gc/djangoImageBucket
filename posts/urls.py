from django.urls import path
from .views import (
    post_list_and_create,
    hello_world_view,
    load_posts_data_view,
    like_unlike_post,
    post_detail,
    post_detail_data_view,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('hello-world/', hello_world_view, name='hello-world'),
    path('data/<int:num_posts>/', load_posts_data_view, name='load-post-data'),
    path('like-unlike', like_unlike_post, name='like-unlike'),
    path('<pk>/', post_detail, name='post-detail'),
    path('<pk>/data/', post_detail_data_view,name='post-detail-data'),
]
