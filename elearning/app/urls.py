#urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', views.home, name='home'),
] 
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

