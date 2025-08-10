import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../../components/ScrollReveal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import OwnerLayout from '../../components/owner/OwnerLayout';

const OwnerProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    // Get user data from localStorage
        const userData = localStorage.getItem('user');
    if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      setEditForm({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || '',
        company: parsedUser.company || '',
        experience: parsedUser.experience || '',
        specialties: parsedUser.specialties || []
      });
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user
      // For now, we'll just update the local state
      setUser(prev => ({
        ...prev,
        ...editForm
      }));
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      company: user?.company || '',
      experience: user?.experience || '',
      specialties: user?.specialties || []
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <OwnerLayout>
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
                          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <ScrollReveal>
                      <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                          Owner Profile
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 px-2">
                          Manage your property owner account and preferences
                        </p>
                      </div>
                    </ScrollReveal>

                            {/* Profile Overview Card */}
                    <ScrollReveal>
                      <Card className="mb-6 sm:mb-8">
                        <CardHeader className="text-center px-4 sm:px-6">
                          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <span className="text-xl sm:text-2xl font-bold text-white">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                          <CardTitle className="text-xl sm:text-2xl">
                            {user.firstName} {user.lastName}
                          </CardTitle>
                          <CardDescription className="text-base sm:text-lg">
                            Property Owner
                          </CardDescription>
                          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2 sm:gap-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                              Verified Owner
                            </Badge>
                            <Badge variant="outline" className="text-xs sm:text-sm">
                              Member since {new Date().getFullYear()}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    </ScrollReveal>

                            {/* Main Content Tabs */}
                    <ScrollReveal>
                      <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 gap-1 sm:gap-2">
                          <TabsTrigger value="personal" className="text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-2">
                            Personal
                          </TabsTrigger>
                          <TabsTrigger value="professional" className="text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-2">
                            Professional
                          </TabsTrigger>
                          <TabsTrigger value="properties" className="text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-2">
                            Properties
                          </TabsTrigger>
                          <TabsTrigger value="preferences" className="text-xs sm:text-sm lg:text-base px-2 sm:px-3 py-2">
                            Preferences
                          </TabsTrigger>
                        </TabsList>

                                    {/* Personal Information Tab */}
                        <TabsContent value="personal" className="space-y-4 sm:space-y-6">
                          <Card className="mx-2 sm:mx-0">
                            <CardHeader className="px-4 sm:px-6">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                                <div>
                                  <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
                                  <CardDescription className="text-sm sm:text-base">
                                    Your basic personal details and contact information
                                  </CardDescription>
                                </div>
                                <Button
                                  variant={isEditing ? "outline" : "default"}
                                  onClick={() => setIsEditing(!isEditing)}
                                  className="text-sm w-full sm:w-auto h-10 sm:h-9"
                                >
                                  {isEditing ? "Cancel" : "Edit"}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <Label htmlFor="firstName" className="text-sm sm:text-base font-medium">First Name</Label>
                                  {isEditing ? (
                                    <Input
                                      id="firstName"
                                      value={editForm.firstName}
                                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                                      className="mt-2 text-sm sm:text-base h-10 sm:h-9"
                                      placeholder="Enter your first name"
                                    />
                                  ) : (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-900 font-medium text-sm sm:text-base">
                                        {user.firstName || 'Not provided'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Label htmlFor="lastName" className="text-sm sm:text-base font-medium">Last Name</Label>
                                  {isEditing ? (
                                    <Input
                                      id="lastName"
                                      value={editForm.lastName}
                                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                                      className="mt-2 text-sm sm:text-base h-10 sm:h-9"
                                      placeholder="Enter your last name"
                                    />
                                  ) : (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                      <p className="text-gray-900 font-medium text-sm sm:text-base">
                                        {user.lastName || 'Not provided'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                                              <div>
                                <Label htmlFor="email" className="text-sm sm:text-base font-medium">Email</Label>
                                {isEditing ? (
                                  <Input
                                    id="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="mt-2 text-sm sm:text-base h-10 sm:h-9"
                                    placeholder="Enter your email"
                                  />
                                ) : (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                                      {user.email || 'Not provided'}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="phone" className="text-sm sm:text-base font-medium">Phone Number</Label>
                                {isEditing ? (
                                  <Input
                                    id="phone"
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="mt-2 text-sm sm:text-base h-10 sm:h-9"
                                    placeholder="Enter your phone number"
                                  />
                                ) : (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                                      {user.phone || 'Not provided'}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="bio" className="text-sm sm:text-base font-medium">Bio</Label>
                                {isEditing ? (
                                  <Textarea
                                    id="bio"
                                    value={editForm.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="mt-2 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                  />
                                ) : (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-md min-h-[60px] sm:min-h-[80px]">
                                    <p className="text-gray-700 text-sm sm:text-base">
                                      {user.bio || 'No bio provided'}
                                    </p>
                                  </div>
                                )}
                              </div>

                                                {isEditing && (
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                  <Button onClick={handleSave} className="flex-1 text-sm sm:text-base h-10 sm:h-9">
                                    Save Changes
                                  </Button>
                                  <Button variant="outline" onClick={handleCancel} className="flex-1 text-sm sm:text-base h-10 sm:h-9">
                                    Cancel
                                  </Button>
                                </div>
                              )}
                </CardContent>
              </Card>
            </TabsContent>

                                    {/* Professional Information Tab */}
                        <TabsContent value="professional" className="space-y-4 sm:space-y-6">
                          <Card className="mx-2 sm:mx-0">
                            <CardHeader className="px-4 sm:px-6">
                              <CardTitle className="text-lg sm:text-xl">Professional Information</CardTitle>
                              <CardDescription className="text-sm sm:text-base">
                                Your business details and professional experience
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                              <div>
                                <Label htmlFor="company" className="text-sm sm:text-base font-medium">Company Name</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                  <p className="text-gray-900 font-medium text-sm sm:text-base">
                                    {user.company || 'Not provided'}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="experience" className="text-sm sm:text-base font-medium">Years of Experience</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                  <p className="text-gray-900 font-medium text-sm sm:text-base">
                                    {user.experience || 'Not specified'}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm sm:text-base font-medium">Specialties</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                  <div className="flex flex-wrap gap-2">
                                    {user.specialties && user.specialties.length > 0 ? (
                                      user.specialties.map((specialty, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                                          {specialty}
                                        </Badge>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm sm:text-base">No specialties listed</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                                    {/* Properties Tab */}
                        <TabsContent value="properties" className="space-y-4 sm:space-y-6">
                          <Card className="mx-2 sm:mx-0">
                            <CardHeader className="px-4 sm:px-6">
                              <CardTitle className="text-lg sm:text-xl">Your Properties</CardTitle>
                              <CardDescription className="text-sm sm:text-base">
                                Overview of your property portfolio
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                              <div className="text-center py-8 sm:py-12">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4">No Properties Yet</h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4 sm:px-8">
                                  You haven't added any properties to your portfolio yet.
                                </p>
                                <Button className="text-sm sm:text-base h-10 sm:h-9 px-6 sm:px-8">
                                  Add Your First Property
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                                    {/* Preferences Tab */}
                        <TabsContent value="preferences" className="space-y-4 sm:space-y-6">
                          <Card className="mx-2 sm:mx-0">
                            <CardHeader className="px-4 sm:px-6">
                              <CardTitle className="text-lg sm:text-xl">Account Preferences</CardTitle>
                              <CardDescription className="text-sm sm:text-base">
                                Manage your notification and privacy settings
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                              <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <Label className="text-sm sm:text-base font-medium">Email Notifications</Label>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Receive updates about your properties</p>
                                  </div>
                                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto h-9 mt-2 sm:mt-0">
                                    Configure
                                  </Button>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <Label className="text-sm sm:text-base font-medium">Privacy Settings</Label>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Control who can see your profile</p>
                                  </div>
                                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto h-9 mt-2 sm:mt-0">
                                    Manage
                                  </Button>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <Label className="text-sm sm:text-base font-medium">Two-Factor Authentication</Label>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Add an extra layer of security</p>
                                  </div>
                                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto h-9 mt-2 sm:mt-0">
                                    Enable
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
          </Tabs>
        </ScrollReveal>

                            {/* Quick Actions */}
                    <ScrollReveal>
                      <Card className="mt-6 sm:mt-8">
                        <CardHeader className="px-4 sm:px-6">
                          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Common tasks and shortcuts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-xs sm:text-sm">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span className="text-xs sm:text-sm">Add Property</span>
                            </Button>
                            
                            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-xs sm:text-sm">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <span className="text-xs sm:text-sm">View Analytics</span>
                            </Button>
                            
                            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-xs sm:text-sm">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="text-xs sm:text-sm">Get Support</span>
                            </Button>
                            
                            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-xs sm:text-sm">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs sm:text-sm">Settings</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
      </div>
    </motion.div>
    </OwnerLayout>
  );
};

export default OwnerProfile; 